import {useCookies} from "react-cookie";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";


const UserPanel = () => {
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(["LoggedUserId", "UserInfo", "Matches", "Chats", "CurrentChat"])
    const [, setUserInfo] = useState(cookies.UserInfo);
    const [currentDiv, setCurrentDiv] = useState("");
    const [likes, setLikes] = useState([]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {

                const response = await axios.get(
                    `http://localhost:8080/userinfo?userId=${cookies.LoggedUserId}`
                );
                setUserInfo(response.data);
                setCookie("UserInfo", response.data);
            } catch (error) {
                console.error("Wystąpił błąd podczas pobierania danych użytkownika:", error);
            }
        };

        fetchUserInfo();
    }, []);
    useEffect(() => {
        const fetchUserChats = async () => {
            try {
                let response = await axios.get('http://localhost:8080/all-user-chats?userId='
                    .concat(cookies.LoggedUserId));
                setCookie("Chats", response.data);
            } catch (error) {
                console.error("Error loading chats:", error);
            }
        };

        fetchUserChats();
    }, []);

    useEffect(() => {
        const fetchUserMatch = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: sessionStorage.getItem("jwtToken"),
                    },
                };

                let response = await axios.get('http://localhost:8080/all-matches?userId='
                    .concat(cookies.LoggedUserId), config);
                setCookie("Matches", response.data);
                setCurrentDiv("matches")
            } catch (error) {
                console.error("Wystąpił błąd podczas pobierania danych użytkownika:", error);
            }
        };

        fetchUserMatch();
    }, []);


    const handleButtonLikesClick = async (divId) => {
        try {
            const config = {
                headers: {
                    Authorization: sessionStorage.getItem('jwtToken')
                },
            };

            let response = await axios.get('http://localhost:8080/likes-received?userId='
                .concat(cookies.LoggedUserId), config);
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
        setCurrentDiv(divId);
    };

    function handleShowChat(chat) {
        setCookie("CurrentChat", chat);
        navigate("/messages");

    }

    return (
        <div className={"user-panel"}>
            <div className={"profile"}>
                <img src={cookies.UserInfo?.url} alt={"User"} onClick={handleImageClick}></img>
                <h2>{cookies.UserInfo?.firstName}</h2>
            </div>

            <div className={'change-section'}>
                <button id={"matches-button"} onClick={() => handleButtonMatchesClick("matches")} className={'section-button'}>Matches
                </button>
                <button id={"messages-button"} onClick={() => handleButtonMessagesClick("messages")} className={'section-button'}>Messages</button>
                <button id={"likes-button"} onClick={() => handleButtonLikesClick("likes")} className={'section-button'}>Likes</button>
            </div>
            {currentDiv === "likes" && (
                <div className={"matches"} id={"likes"}>
                    <ul>
                        {likes.map((like, index) => (
                            <li
                                onClick={() => handleShowProfile(like)}
                                className={"match-card"}
                                key={index}
                                style={{backgroundImage: `url(${like.url})`}}>
                                <span>{like.firstName}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {currentDiv === "matches" && (
                <div className={"matches"} id={"matches"}>
                    <ul>
                        {cookies.Matches.map((match, index) => (
                            <li
                                onClick={() => handleShowProfile(match)}
                                className={"match-card"}
                                key={index}
                                style={{backgroundImage: `url(${match.url})`}}>
                                <span>{match.firstName}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {currentDiv === "messages" && (
                <div className={"messages"} id={"messages"}>
                    <ul>
                        {cookies.Chats.map((chat, index) => (
                            <li
                                onClick={() => handleShowChat(chat)}
                                className={"message-card"}
                                key={index}>
                                <img className={"message-photo"} alt={chat.id} src="blalla"></img>
                                <span className={"first-name"}>{chat.id}</span>
                                <span className={"last-message"}>Wiadomosc ostatnia</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
export default UserPanel;
