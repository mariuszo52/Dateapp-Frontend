import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import axios from "axios";
import UserPanel from "../components/UserPanel";
import {getKeyEventProps} from "@testing-library/user-event/dist/keyboard/getEventProps";

const Messages = () => {
    const [cookies, setCookie] = useCookies(["LoggedUserId", "UserInfo", "CurrentChat", "MatchedUserId"]);
    const [stompClient, setStompClient] = useState();
    const [messages, setMessages] = useState([]);
    const [matchedUserInfo, setMatchedUserInfo] = useState();
    let   [value, setValue]  = useState();
    let [areaFocus, setAreaFocus] = useState(true);
    async function getMessages() {
        axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("jwtToken");
        try {
            let response = await axios.get('http://localhost:8080/get-chat-messages?chatId='.concat(cookies.CurrentChat.id));
            setMessages(response.data);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        if (cookies.CurrentChat.id) {
            getMessages();
        }
    }, []);
    useEffect(() => {
        function checkMatchUserId() {
            const participants = cookies.CurrentChat.participantsIds;

            if (cookies.LoggedUserId == participants[0]) {
                setCookie("MatchedUserId", participants[1]);
            } else {
                setCookie("MatchedUserId", participants[0]);
                }
        }
        checkMatchUserId();
    }, []);
    useEffect(() => {
        async function getMatchedUserInfo() {
            try {
                let response = await axios.get('http://localhost:8080/userinfo?userId='.concat(cookies.MatchedUserId));
                setMatchedUserInfo(response.data);
            } catch (err) {
                console.log(err);
            }
        }

        if (cookies.MatchedUserId) {
            getMatchedUserInfo();
        }
    }, [cookies.MatchedUserId]);

    useEffect(() => {
        function connect() {
            const socket = new SockJS('http://localhost:8080/chat');
            const client = Stomp.over(socket);
            client.connect([], function (frame) {
                console.log('Connected: ' + frame);
                client.subscribe('/topic/'.concat(cookies.CurrentChat.id), function (messageOutput) {
                    showMessageOutput(JSON.parse(messageOutput.body));
                });
            });

            setStompClient(client);
        }

        if (cookies.CurrentChat.id) {
            connect();
        }

        return () => {
            if (stompClient != null) {
                stompClient.disconnect();
            }
        };
    }, [cookies.CurrentChat.id]);
    function clearTextArea(){
        setValue();
        //value ma byc pobierane z funkcji pisania
        setAreaFocus(true)


    }

    async function sendMessage() {
        const currentMessage = document.getElementById('text').value;
        const chatId = cookies.CurrentChat.id;
        const fromUserId = cookies.UserInfo.id;
        if (stompClient !== null) {
            const message = {
                chatId: chatId,
                fromUserId: fromUserId,
                text: currentMessage,
            };
            try {
                await axios.post('http://localhost:8080/send-message', message);
                clearTextArea()
            } catch (err) {
                console.log(err);
            }
        }


    }

    function showMessageOutput(messageOutput) {
        const response = document.getElementById("message");
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(messageOutput.text));
        response.appendChild(p);
    }

    useEffect(() => {
        function showChatMessages() {
            const container = document.getElementById("message");
            container.innerHTML = '';
            messages.forEach((element) => {
                const paragraph = document.createElement("p");
                paragraph.textContent = element.text;
                container.appendChild(paragraph);
            });
        }

        showChatMessages();
    }, [messages]);
    function handleKeyDown(event) {
        if (event.keyCode === 13) {
            sendMessage()
        }
    }
    return (
        <div className="dashboard">
            <UserPanel />
            <div className="messenger-container">
                <div className={"mess"}>
                    <div className={"messages-container"}>
                        <div className={"match-info"}>
                            <img src={matchedUserInfo?.url} alt={"Match"}></img>
                            <p>
                                You matched with {matchedUserInfo?.firstName} on {cookies.CurrentChat?.matchDate}
                            </p>
                        </div>
                        <div id={"message"}></div>
                    </div>
                    <div id={"message-text"}>
                        <textarea autoFocus={true} value={value} placeholder={"Type a message"} id={"text"}></textarea>
                        <button onKeyDown={() => handleKeyDown(getKeyEventProps())} onClick={sendMessage}>Send</button>
                    </div>
                </div>
                <div className={"message-profile"}></div>
            </div>
        </div>
    );
}

export default Messages;
