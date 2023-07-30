import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import axios from "axios";
import UserPanel from "../components/UserPanel";

const Messages = () => {
    const [cookies, setCookie] = useCookies(["LoggedUserId", "UserInfo", "CurrentChat","Match"]);
    const [stompClient, setStompClient] = useState();
    const [messages, setMessages] = useState([]);
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
        async function getMatch() {
            try {
                let response = await axios.get('http://localhost:8080/match?id='.concat(cookies.CurrentChat.matchId));
                setCookie("Match", response.data);
            } catch (err) {
                console.log(err);
            }
        }

        if (cookies.CurrentChat.matchId) {
            getMatch();
        }
    }, [cookies.CurrentChat.matchId]);

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


    return (
        <div className="dashboard">
            <UserPanel />
            <div className="messenger-container">
                <div className={"mess"}>
                    <div className={"messages-container"}>
                        <div className={"match-info"}>
                            <p>You matched at {cookies.Match?.matchDate} </p>
                        </div>
                        <div id={"message"}></div>
                    </div>
                    <div id={"message-text"}>
                        <textarea placeholder={"Type a message"} id={"text"}></textarea>
                        <button autoFocus={true} onClick={sendMessage}>Send</button>
                    </div>
                </div>
                <div className={"message-profile"}></div>
            </div>
        </div>
    );
}

export default Messages;
