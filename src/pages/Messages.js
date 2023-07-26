import UserPanel from "../components/UserPanel";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

const Messages = () => {
    const [cookies] = useCookies(["LoggedUserId", "UserInfo"]);
    const [stompClient, setStompClient] = useState()

    useEffect(() => {
        function connect() {
            var socket = new SockJS('http://localhost:8080/chat');
            const client = Stomp.over(socket);

            var headers = {
                Authorization: sessionStorage.getItem("jwtToken")
            };

            client.connect(headers, function(frame) {
                console.log('Connected: ' + frame);
                client.subscribe('/topic/1', function(messageOutput) {
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

    function sendMessage() {
        const currentMessage = document.getElementById('text').value;
        if (stompClient !== null) {
            stompClient.send("/app/chat", {}, JSON.stringify({'from': cookies.UserInfo.firstName, 'text': currentMessage}));
        } else {
            console.log("stompClient is null. Unable to send message.");
        }
    }

    function showMessageOutput(messageOutput) {
        const response = document.getElementById("message");
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(messageOutput.from + ": " + messageOutput.text));
        response.appendChild(p);
    }

    return (
        <div className="dashboard">
            <UserPanel />
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
