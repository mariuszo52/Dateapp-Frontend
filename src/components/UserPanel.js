import {useCookies} from "react-cookie";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const UserPanel = ({newMessage, newMatch, distance}) => {
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(["LoggedUserId", "UserInfo", "CurrentChat"])
    const [currentDiv, setCurrentDiv] = useState("matches");
    const [likes, setLikes] = useState([]);
    const [chats, setChats] = useState([]);
    const [matches, setMatches] = useState([])
    const [chatNotifications, setChatNotifications] = useState({});
    const [unreadChats, setUnreadChats] = useState(0);


    async function fetchUserChatNotifications(chatId) {
        try {
            const response = await axios.get('http://localhost:8080/notifications-counter?chatId=' + chatId);
            return response.data
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function checkNewMessages() {
            try {
                const response = await axios.get('http://localhost:8080/unread-chats');
                let notificationSpan = document.getElementById("new-message");
                setUnreadChats(response.data);
                if (response.data === 0) {
                    notificationSpan.setAttribute("hidden", "true")
                } else {
                    notificationSpan.removeAttribute("hidden")
                }
            } catch (error) {
                console.error(error);
            }
        }

        checkNewMessages();
    }, [chatNotifications, newMessage]);

    useEffect(() => {
        async function fetchNotificationsForChats() {
            const notificationsData = {};

            for (const chat of chats) {
                notificationsData[chat.id] = await fetchUserChatNotifications(chat.id);
                let notificationSpan = document.getElementById("new-message-".concat(chat.id));
                if (notificationsData[chat.id] === 0) {
                    notificationSpan?.setAttribute("hidden", "true");
                } else {
                    notificationSpan?.setAttribute('style', 'color: darkgoldenrod;');
                }
            }
            setChatNotifications(notificationsData);
        }

        fetchNotificationsForChats();
    }, [chats]);


    useEffect(() => {
        const fetchUserMatch = async () => {
            try {
                let response = await axios.get('http://localhost:8080/all-matches');
                setMatches(() => response.data)
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserMatch();
    }, [newMatch]);

    const fetchUserChats = async () => {
        try {
            let response = await axios.get('http://localhost:8080/all-user-chats');
            setChats(response.data)
        } catch (error) {
            console.error("Error loading chats:", error);
        }
    };

    useEffect(() => {
        fetchUserChats()

    }, [newMessage]);


    const handleButtonLikesClick = async (divId) => {
        try {
            let response = await axios.get('http://localhost:8080/likes-received');
            console.log(response.data)
            setLikes(response.data)
        } catch (error) {
            console.error(error);
        }
        for (const buttons of document.getElementsByClassName("section-button")) {
            buttons.style.setProperty("background-color", "black")
        }
        document.getElementById("likes-button").style.setProperty("background-color", "grey")
        setCurrentDiv(divId);
    };
    const handleButtonMatchesClick = async (divId) => {
        for (const buttons of document.getElementsByClassName("section-button")) {
            buttons.style.setProperty("background-color", "black")
        }
        document.getElementById("matches-button").style.setProperty("background-color", "grey")
        setCurrentDiv(divId);
    };

    function handleImageClick() {
        navigate("/profile")
    }

    function handleShowProfile(profile) {
        console.log(profile)
        setCookie("profile", profile)
        navigate("/like-profile")

    }

    const handleButtonMessagesClick = async (divId) => {
        for (const buttons of document.getElementsByClassName("section-button")) {
            buttons.style.setProperty("background-color", "black")
        }
        document.getElementById("messages-button").style.setProperty("background-color", "grey")
        await fetchUserChats();
        setCurrentDiv(divId);
    };

    async function resetUnreadMessageCount(chatId) {
        try {
            let response = await axios.put('http://localhost:8080/notifications-counter-reset?chatId='
                + chatId + "&userId=" + cookies.LoggedUserId);
            console.log(response.status)

        } catch (error) {
            console.error(error);
        }
    }

    function handleShowChat(chat) {
        setCookie("CurrentChat", chat);
        if (window.location.pathname === "/messages") {
            window.location.reload();
        } else {
            navigate("/messages");
        }
        resetUnreadMessageCount(chat.id).then(r => console.log(r))
    }

    function lastMessageLimited(lastMessage) {
        return lastMessage.length >= 30 ? lastMessage.slice(0, 29) + "..." : lastMessage;
    }



    return (
        <div className="user-panel">
            <div className="profile">
                <img src={cookies.UserInfo?.url} alt="User" onClick={handleImageClick}/>
                <h2>{cookies.UserInfo?.firstName}</h2>
            </div>
            <div className="change-section">
                <button
                    id="matches-button"
                    onClick={() => handleButtonMatchesClick("matches")}
                    className="section-button"
                >
                    Matches
                </button>
                <button
                    id="messages-button"
                    onClick={() => handleButtonMessagesClick("messages")}
                    className="section-button"
                >
                    Messages
                    <span id={"new-message"}>({unreadChats})</span>
                </button>
                <button
                    id="likes-button"
                    onClick={() => handleButtonLikesClick("likes")}
                    className="section-button"
                >
                    Likes
                </button>
            </div>

            {currentDiv === "likes" && (
                <div className="matches" id="likes">
                    <ul>
                        {likes?.map((like, index) => (
                            <li
                                onClick={() => handleShowProfile(like)}
                                className="match-card"
                                key={index}
                                style={{backgroundImage: `url(${like.url})`}}
                            >
                                <span>{like.firstName}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {currentDiv === "matches" && (
                <div className="matches" id="matches">
                    <ul>
                        {matches?.map((match, index) => (
                            <li
                                onClick={() => handleShowProfile(match)}
                                className="match-card"
                                key={index}
                                style={{backgroundImage: `url(${match.url})`}}
                            >
                                <span>{match.firstName}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {currentDiv === "messages" && (
                <div className="messages" id="messages">
                    {chats?.map((chat, index) => (
                        <ul
                            onClick={() => handleShowChat(chat)}
                            className="message-card"
                            key={index}
                        >
                            {parseInt(cookies.LoggedUserId) === chat.matchDtos[0].userId ? (
                                <li>
                                <span className="first-name">
                                    {chat.matchDtos[0].matchedUserName}
                                </span>
                                    <img
                                        className="message-photo"
                                        alt={chat.matchDtos[0].userId}
                                        src={chat.matchDtos[0].matchedUserUrl}
                                    />
                                    <span className="last-message">{lastMessageLimited(chat.lastMessage)}</span>
                                    <span id={"new-message-".concat(chat.id)}>
                                    {chatNotifications[chat.id]}
                                </span>
                                </li>
                            ) : (
                                <li>
                                <span className="first-name">
                                    {chat.matchDtos[1].matchedUserName}
                                </span>
                                    <img
                                        className="message-photo"
                                        alt={chat.matchDtos[1].userId}
                                        src={chat.matchDtos[1].matchedUserUrl}
                                    />
                                    <span className="last-message">{lastMessageLimited(chat.lastMessage)}</span>
                                    <span id={"new-message-".concat(chat.id)}>
                                    {chatNotifications[chat.id]}
                                </span>
                                </li>
                            )}
                        </ul>
                    ))}
                </div>
            )}
        </div>
    );
}
export default UserPanel;