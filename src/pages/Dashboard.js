import TinderCard from 'react-tinder-card'
import UserPanel from "../components/UserPanel";
import {useEffect, useState} from "react";
import axios from "axios";
import {useCookies} from "react-cookie";

const Dashboard = () => {
    axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("jwtToken");
    const [cards, setCards] = useState([]);
    const [cookies] = useCookies(["LoggedUserId"]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/get-swipe-users`);
                setCards(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

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
        try {
            const data = {
                userId: cookies.LoggedUserId, swipedProfileId: swipedProfileId,
            };

            const response = await axios.post("http://localhost:8080/swipe-right", data);
            if (response.data === "match") {
                alert("It's a match!!")
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
            <UserPanel />
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
