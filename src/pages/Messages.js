import UserPanel from "../components/UserPanel";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import axios from "axios";

const Messages = () => {
    const [cookies] = useCookies(["LoggedUserId", "UserInfo", "CurrentChat"]);
    const [stompClient, setStompClient] = useState()
    useEffect(() => {
        async function getMessages() {
            try {
                let response = await axios.get('http://localhost:8080/get-chat-messages?chatId='.concat(cookies.CurrentChat));
                let messages = response.data;
                alert(messages)
            } catch (err) {
                console.log(err)
            }

        }

        getMessages();
    }, []);

    useEffect(() => {
        axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("jwtToken");
        function connect() {
            const socket = new SockJS('http://localhost:8080/chat');
            const client = Stomp.over(socket);
            client.connect([], function(frame) {
                console.log('Connected: ' + frame);
                client.subscribe('/topic/'.concat(cookies.CurrentChat), function(messageOutput) {
                    showMessageOutput(JSON.parse(messageOutput.body));
                });
            });

            setStompClient(client);
        }

        connect();
        return () => {
            if (stompClient != null) {
                stompClient.disconnect();
            }
        };
    }, []);
    function disconnect() {
        if(stompClient != null) {
            stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    async function sendMessage() {
        const currentMessage = document.getElementById('text').value;
        const chatId = cookies.CurrentChat;
        const fromUserId = cookies.UserInfo.id;
        if (stompClient !== null) {
            const message = {
                chatId: chatId,
                fromUserId: fromUserId,
                text: currentMessage,
            };
            try {
                await axios.post('http://localhost:8080/send-message', message);
            }catch (err){
            console.log(err)}
        }

        }

        function showMessageOutput(messageOutput) {
            const response = document.getElementById("message");
            const p = document.createElement('p');
            p.appendChild(document.createTextNode(messageOutput.text));
            response.appendChild(p);
        }

        return (
            <div className="dashboard">
                <UserPanel/>
                <div className="messenger-container">
                    <div className={"mess"}>
                        <div className={"messages-container"}>
                            <div id={"message"}></div>
                        </div>
                        <div id={"message-text"}>
                            <textarea placeholder={"Type a message"} id={"text"}></textarea>
                            <button autoFocus={true} onClick={sendMessage}>Send</button>
                        </div>
                    </div>

                    <div className={"message-profile"}>

                    </div>
                </div>
            </div>
        );
    };

export default Messages;
