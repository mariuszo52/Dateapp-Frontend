import React, {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import axios from "axios";
import UserPanel from "../components/UserPanel";
import InfiniteScroll from "react-infinite-scroll-component";

const Messages = () => {
    const [cookies, setCookie] = useCookies(["LoggedUserId", "UserInfo", "CurrentChat", "MatchedUserId"]);
    const [stompClient, setStompClient] = useState();
    const [messages, setMessages] = useState([]);
    const [matchedUserInfo, setMatchedUserInfo] = useState();
    let [textArea, setTextArea] = useState("");

    async function getMessages() {
        axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("jwtToken");
        try {
            let response = await axios.get('http://localhost:8080/get-chat-messages?chatId='
                .concat(cookies.CurrentChat.id).concat("&size=20&page=0"));
            setMessages(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    const handleKeypress = event => {
        if (event.keyCode === 13) {
            sendMessage();
        }
    };
    const handleChange = event => {
        setTextArea(event.target.value)

    }
    useEffect(() => {
        if (cookies.CurrentChat.id) {
            getMessages();
        }
    }, []);

    useEffect(() => {
        function checkMatchUserId() {
            const participants = cookies.CurrentChat.participantsIds;

            if (cookies.LoggedUserId === participants[0].toString()) {
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

        function showMessageOutput(messageOutput) {
            const message = document.getElementById("message");
            const div = document.createElement('div');
            if(messageOutput.fromUserId.toString() === cookies.LoggedUserId){
                div.setAttribute("class", "message-send-div")
            }
            else {
                div.setAttribute("class", "message-received-div")
            }

            const p = document.createElement('p');
            div.appendChild(p)
            p.appendChild(document.createTextNode(messageOutput.text));
            message.appendChild(div);
        }




    useEffect(() => {
        function connect() {
            const socket = new SockJS('http://localhost:8080/chat');
            const client = Stomp.over(socket);
            client.connect([], function (frame) {
                console.log('Connected: ' + frame);
                client.subscribe('/topic/'.concat(cookies.CurrentChat.id), function (messageOutput) {
                    showMessageOutput(JSON.parse(messageOutput.body))
                })
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
                setTextArea("");
            } catch (err) {
                console.log(err)
            }
        }


    }

    useEffect(() => {
        function showChatMessages() {
            const container = document.getElementById("message");
            container.innerHTML = '';
            messages.forEach((element) => {
                const div = document.createElement("div")
                if(element.fromUserId.toString() === cookies.LoggedUserId){
                    div.setAttribute("class", "message-send-div")
                }
                else {
                    div.setAttribute("class", "message-received-div")
                }
                const paragraph = document.createElement("p");
                div.appendChild(paragraph)
                paragraph.textContent = element.text;
                container.appendChild(div);
            });
        }

        showChatMessages();
    }, [messages]);

    return (
        <div className="dashboard">
            <UserPanel/>
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
                        <textarea onKeyDown={handleKeypress} onChange={handleChange} value={textArea} autoFocus={true}
                                  placeholder={"Type a message"} id={"text"}></textarea>
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
                <div className={"message-profile"}>
                    <img src={matchedUserInfo?.url} alt="Matched user"></img>
                    <h1>{matchedUserInfo?.firstName} {matchedUserInfo?.age}</h1>
                    <p>{matchedUserInfo?.genderIdentity}</p>
                    <p>Interested in: {matchedUserInfo?.genderInterest}</p>
                    <p>{matchedUserInfo?.about}</p>
                </div>
            </div>
        </div>
    );
}

export default Messages;
