import TinderCard from 'react-tinder-card'
import UserPanel from "../components/UserPanel";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const Dashboard = () => {
    const [cards, setCards] = useState([]);
    const [cookies] = useCookies(["LoggedUserId"]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: sessionStorage.getItem("jwtToken"),
                    },
                };
                const response = await axios.get(
                    `http://localhost:8080/get-swipe-users?userId=${cookies.LoggedUserId}`,
                    config
                );
                setCards(response.data);
            } catch (error) {
                console.error("Wystąpił błąd podczas pobierania użytkowników:", error);
            }
        };

        fetchData();
    }, [cookies.LoggedUserId]);

    const saveLeftSwipe = async (swipedProfileId) => {
        try {
            const config = {
                headers: {
                    Authorization: sessionStorage.getItem("jwtToken"),
                },
            };

            const data = {
                userId: cookies.LoggedUserId,
                leftSwipedProfileId: swipedProfileId,
            };

            const response = await axios.post(
                "http://localhost:8080/swipe-left",
                data,
                config
            );
            console.log(response.data);
        } catch (error) {
            console.error("Wystąpił błąd podczas zapisywania odrzuconego przesunięcia:", error);
        }
    };

    const swiped = (dir, swipedProfileId) => {
        if (dir === "left") {
            saveLeftSwipe(swipedProfileId);
        }
    };

    return (
        <div className="dashboard">
            <UserPanel />
            <div className="card-container">
                {cards?.map((user) => (
                    <TinderCard
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
                    </TinderCard>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
