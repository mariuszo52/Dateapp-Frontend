import TinderCard from 'react-tinder-card'
import UserPanel from "../components/UserPanel";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import jwtDecode from "jwt-decode";

const Dashboard = () => {
    axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("jwtToken");
    const [cards, setCards] = useState([]);
    const [cookies, setCookies] = useCookies(["LoggedUserId", "UserInfo"]);
    const [newMatch, setNewMatch] = useState(false)
    const [distance] = useState(cookies.UserInfo.maxDistance);
    const [notification, setNotification] = useState("")

    useEffect(() => {
        const fetchLoggedUserId = async () => {
            try {
                let response = await axios.get('http://localhost:8080/logged-user-id');
                setCookies("LoggedUserId", response.data)
            } catch (error) {
                console.log(error)
            }
        };

        fetchLoggedUserId();
    }, []);
    const fetchUsersToSwipe = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/get-swipe-users?distance=` + distance);
            setCards(response.data);
        } catch (error) {
            setNotification("Error during loading cards.")
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsersToSwipe();
    }, []);

    const saveLeftSwipe = async (swipedProfileId) => {
        try {
            const data = {
                userId: cookies.LoggedUserId, swipedProfileId: swipedProfileId,
            };
            const response = await axios.post("http://localhost:8080/swipe-left", data);
            console.log(response.data);
        } catch (error) {
            setNotification("Left swipe failed.")
            console.error(error);
        }
    };

    function saveRightSwipe(swipedProfileId) {
        setNewMatch(false)
        const data = {
            userId: cookies.LoggedUserId, swipedProfileId: swipedProfileId,
        };
        axios.post("http://localhost:8080/swipe-right", data)
            .then(response => {
                if (response.data === "match") {
                    alert("It's a match!!")
                    setNewMatch(true)
                }
            }).catch(error => {
                console.log(error)
                setNotification("Right swipe failed.")
        })

    }

    const swiped = (dir, swipedProfileId) => {
        if (dir === "left") {
            saveLeftSwipe(swipedProfileId).then(r => console.log("swiped left"));
        }
        if (dir === "right") {
            saveRightSwipe(swipedProfileId);
        }
    };

    function handleClickMenuButton() {
        let userPanel = document.getElementsByClassName("user-panel").item(0);
        let container = document.getElementsByClassName("card-container").item(0);
        let menuButton = document.getElementById("menu-button");
        if(window.getComputedStyle(container).display === "flex"){
            container.style.display = "none"
            userPanel.style.display = "flex"
            userPanel.style.width = "100%"
            menuButton.innerText = "Show cards"

        }
        else if(window.getComputedStyle(container).display === "none"){
            container.style.display = "flex"
            userPanel.style.display = "none"
            menuButton.innerText = "Show User panel"

        }

    }


    return (
        <div className={"main-container"}>
            <button id={"menu-button"} onClick={handleClickMenuButton}>Show User panel</button>
            <div className="dashboard">
                <UserPanel newMatch={newMatch} setNotification={setNotification}/>
                <div className="card-container">
                    {notification && (<h3 id={"notification"} className={"notification"}>{notification}</h3>)}
                    {cards?.map((user) => (
                        <TinderCard
                            className="swipe"
                            key={user.userId}
                            onSwipe={(dir) => swiped(dir, user.userId)}
                            preventSwipe={["up", "down"]}
                        >
                            <div
                                style={{
                                    backgroundImage: `url(${user.url})`
                                }}
                                className="card"
                            >
                                <h2>{user.firstName} {user.age} {user.locationName}</h2>
                                <p>{user.about}</p>
                            </div>
                        </TinderCard>))}
                </div>
            </div>
            </div>
    );
}

export default Dashboard;