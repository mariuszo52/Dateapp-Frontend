import React, {useEffect, useRef, useState} from "react";
import {useCookies} from "react-cookie";
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import axios from "axios";
import UserPanel from "../components/UserPanel";
import {useNavigate} from "react-router-dom"

const Messages = () => {
    const [cookies] = useCookies(["LoggedUserId", "UserInfo", "CurrentChat"]);
    const [stompClient, setStompClient] = useState();
    const [messages, setMessages] = useState([]);
    const [matchedUserInfo, setMatchedUserInfo] = useState();
    const [textArea, setTextArea] = useState("");
    const messageContainerRef = useRef(null);
    const [, setNotificationCounter] = useState();
    const [ticketText, setTicketText] = useState("");
    const [matchedUserId, setMatchedUserId] = useState(null);
    const [newMessage, setNewMessage] = useState(0)
    const [loggedUserId] = useState(parseInt(cookies.LoggedUserId))
    const navigate = useNavigate();

    async function getChatNotificationsCounter() {
        try {
            let response = await axios.get('http://localhost:8080/notifications-counter',
                {
                    params: {
                        chatId: cookies.CurrentChat.id
                    }
                });
            setNotificationCounter(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    async function getMessages() {
        try {
            let response = await axios.get('http://localhost:8080/messages',
                {
                    params: {
                        chatId: cookies.CurrentChat.id
                    }
                });
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
            if (loggedUserId === participants[0]) {
                setMatchedUserId(participants[1])
            } else {
                setMatchedUserId(participants[0])
            }
        }

        checkMatchUserId();
    }, []);

    useEffect(() => {
        async function getMatchedUserInfo() {
            try {
                let response =
                    await axios.get('http://localhost:8080/matched-user-info', {
                        params:{
                            userId: matchedUserId,
                            chatId: cookies.CurrentChat.id
                        }
                    });
                setMatchedUserInfo(response.data);
            } catch (err) {
                console.log(err);
            }
        }

        if (matchedUserId != null) {
            getMatchedUserInfo();
        }

    }, [matchedUserId]);

    function showMessageOutput(messageOutput) {
        const message = document.getElementById("message");
        const div = document.createElement('div');
        if (messageOutput.fromUserId === loggedUserId) {
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
                let response = await axios.post('http://localhost:8080/ws-ticket',null, {
                    params:{
                        userId:cookies.LoggedUserId
                    }});
                setTicketText(response.data.text)
                console.log("Ticked fetched.")
            } catch (err) {
                console.log(err)
            }
        }

        fetchWebSocketTicket()
    }, []);


    async function updateChatNotificationsCounter() {
        try {
            await axios.put('http://localhost:8080/notifications-counter', null, {
                params:{
                    chatId:cookies.CurrentChat.id
                }});
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
            async function connect() {
                const socket = new SockJS('http://localhost:8080/chat?ticketText=' + ticketText);
                const client = Stomp.over(socket);
                client.connect([], function (frame) {
                    console.log('Connected: ' + frame);
                    client.subscribe('/topic/'.concat(cookies.CurrentChat.id), function (messageOutput) {
                        setNewMessage(newMessage => newMessage + 1);
                        getChatNotificationsCounter()
                        showMessageOutput(JSON.parse(messageOutput.body))
                        setTicketText("");
                    })
                });

                setStompClient(client);
            }

            if (ticketText !== "") {
                connect();
            }

            return () => {
                if (stompClient != null) {
                    stompClient.disconnect();
                }
            };
        },
        [ticketText]
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
                await updateChatNotificationsCounter();
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
                if (element.fromUserId === loggedUserId) {
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

    function deletePairButtonClick() {
        axios.put("http://localhost:8080/unmatch", null, {
            params:{
                chatId:cookies.CurrentChat.id
            }})
            .then(r => console.log("Pair deleted correctly"),
                reason => console.log(reason))
        navigate("/dashboard")
    }

    return (
        <div className="dashboard">
            <UserPanel newMessage={newMessage}/>
            <div className="messenger-container">
                <div className={"mess"}>
                    <div className={"messages-container"} ref={messageContainerRef}>
                        <div className={"match-info"}>
                            <img src={matchedUserInfo?.url} alt={"Match"}></img>
                            <p>
                                You matched with {matchedUserInfo?.firstName} on {cookies.CurrentChat?.matchDate}
                            </p>
                            <button onClick={deletePairButtonClick} className={"login-button"}>Delete Pair</button>
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
                    <p>{matchedUserInfo?.locationDto.name}</p>
                    <p>{matchedUserInfo?.genderIdentity}</p>
                    <p>Interested in: {matchedUserInfo?.genderInterest}</p>
                    <p>{matchedUserInfo?.about}</p>
                </div>
            </div>
        </div>
    );
}

export default Messages;
