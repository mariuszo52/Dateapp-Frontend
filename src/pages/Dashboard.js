import TinderCard from 'react-tinder-card'
import UserPanel from "../components/UserPanel";
import {useEffect, useState} from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import {type} from "@testing-library/user-event/dist/type";

const Dashboard = () => {
    axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("jwtToken");
    const [cards, setCards] = useState([]);
    const [cookies, setCookies] = useCookies(["LoggedUserId", "UserInfo"]);
    const [newMatch, setNewMatch] = useState(false)
    const [distance, setDistance] = useState(cookies.UserInfo.maxDistance);
    const handleDistanceChange = (newDistance) => {
        setDistance(newDistance);
    };

    useEffect(() => {
            const fetchLoggedUserId = async () => {
                try {
                    let response = await axios.get('http://localhost:8080/logged-user-id');
                    setCookies("LoggedUserId", response.data)
                }catch (error){
                    console.log(error)
                }
            };

        fetchLoggedUserId();
    }, []);

    useEffect(() => {
        const fetchUsersToSwipe = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/get-swipe-users?distance=` + distance);
                setCards(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsersToSwipe();
    }, [distance]);

    const saveLeftSwipe = async (swipedProfileId) => {
        try {
            const data = {
                userId: cookies.LoggedUserId, swipedProfileId: swipedProfileId,
            };
            const response = await axios.post("http://localhost:8080/swipe-left", data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const saveRightSwipe = async (swipedProfileId) => {
        setNewMatch(false)
        try {
            const data = {
                userId: cookies.LoggedUserId, swipedProfileId: swipedProfileId,
            };

            const response = await axios.post("http://localhost:8080/swipe-right", data);
            if (response.data === "match") {
                alert("It's a match!!")
                setNewMatch(true)
            }
        } catch (error) {
            console.error(error);
        }
    };

    const swiped = (dir, swipedProfileId) => {
        if (dir === "left") {
            saveLeftSwipe(swipedProfileId).then(r => console.log("swiped left"));
        }
        if (dir === "right") {
            saveRightSwipe(swipedProfileId).then(r => console.log("swiped right"))
        }
    };

    return (<div className="dashboard">
            <UserPanel newMatch={newMatch} onDistanceChange={handleDistanceChange} />
            <div className="card-container">
                {cards?.map((user) => (<TinderCard
                        className="swipe"
                        key={user.userId}
                        onSwipe={(dir) => swiped(dir, user.userId)}
                    >
                        <div
                            style={{
                                backgroundImage: `url(${user.url})`
                            }}
                            className="card"
                        >
                            <h2>{user.firstName} {user.age}</h2>
                            <p>{user.about}</p>
                        </div>
                    </TinderCard>))}
            </div>
        </div>);
};

export default Dashboard;
