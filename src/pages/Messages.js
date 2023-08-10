import React, {useEffect, useRef, useState} from "react";
import {useCookies} from "react-cookie";
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import axios from "axios";
import UserPanel from "../components/UserPanel";

const Messages = () => {
    const [cookies, setCookie] = useCookies(["LoggedUserId", "UserInfo", "CurrentChat", "MatchedUserId"]);
    const [stompClient, setStompClient] = useState();
    const [messages, setMessages] = useState([]);
    const [matchedUserInfo, setMatchedUserInfo] = useState();
    const [textArea, setTextArea] = useState("");
    const messageContainerRef = useRef(null);
    const [notificationCounter, setNotificationCounter] = useState(0);
    const [chatUsername, setChatUsername] = useState("");
    const [ticketText, setTicketText] = useState("");
    const [isTicketValid, setIsTicketValid] = useState(false);


    useEffect(() => {
        function updateNotificationDisplay() {
            console.log(notificationCounter)
            let notification = document.getElementById("notification");
            if (notificationCounter === 0) {
                notification.setAttribute("hidden", "true");

            } else {
                notification.removeAttribute("hidden")
                notification.textContent = notificationCounter.toString();
            }

        }

        updateNotificationDisplay()
    }, [notificationCounter, chatUsername]);


    async function getMessages() {
        axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("jwtToken");
        try {
            let response = await axios.get('http://localhost:8080/get-chat-messages?chatId='
                .concat(cookies.CurrentChat.id));
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
    }, []);

    function showMessageOutput(messageOutput) {
        const message = document.getElementById("message");
        const div = document.createElement('div');
        if (messageOutput.fromUserId.toString() === cookies.LoggedUserId) {
            div.setAttribute("class", "message-send-div")
        } else {
            div.setAttribute("class", "message-received-div")
        }

        const p = document.createElement('p');
        div.appendChild(p)
        p.appendChild(document.createTextNode(messageOutput.text));
        message.appendChild(div);
    }

    useEffect(() => {
        async function fetchWebSocketTicket() {
            try {
                let response = await axios.post('http://localhost:8080/ws-ticket?userId=' + cookies.LoggedUserId);
                setTicketText(response.data.text)
                console.log("Ticked fetched.")
            } catch (err) {
                console.log(err)
            }
        }
        fetchWebSocketTicket()
    }, []);

    useEffect(() => {
        async function fetchWebSocketTicket() {
            try {
                let response = await axios.get('http://localhost:8080/ticket-validity?ticketText=' + ticketText);
                setIsTicketValid(response.data)
            } catch (err) {
                console.log(err)
            }
        }
        if(ticketText !== "")
        fetchWebSocketTicket()
    }, [ticketText]);


    useEffect(() => {
            async function connect() {
                const socket = new SockJS('http://localhost:8080/chat?ticketText=' + ticketText);
                const client = Stomp.over(socket);
                client.connect([], function (frame) {
                    setChatUsername(frame.headers["user-name"])
                    console.log('Connected: ' + frame);
                    client.subscribe('/topic/'.concat(cookies.CurrentChat.id), function (messageOutput) {
                        setNotificationCounter(notificationCounter =>
                            notificationCounter + 1);
                        showMessageOutput(JSON.parse(messageOutput.body))
                        setTicketText("");
                    })
                });

                setStompClient(client);
            }

            if (ticketText !== "" && isTicketValid) {
                connect();
            }

            return () => {
                if (stompClient != null) {
                    stompClient.disconnect();
                }
            };
        },
        [isTicketValid]
    );

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
                if (element.fromUserId.toString() === cookies.LoggedUserId) {
                    div.setAttribute("class", "message-send-div")
                } else {
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

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    });

    return (
        <div className="dashboard">
            <UserPanel/>
            <div className="messenger-container">
                <div className={"mess"}>
                    <div className={"messages-container"} ref={messageContainerRef}>
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
                    <span id={"notification"}></span>
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
