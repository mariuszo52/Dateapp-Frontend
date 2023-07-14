
import UserPanel from "../components/UserPanel";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const Messages = () => {
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
            } catch (error) {
                console.error("Wystąpił błąd podczas pobierania użytkowników:", error);
            }
        };

        fetchData();
    }, [cookies.LoggedUserId]);



    return (
        <div className="dashboard">
            <UserPanel />
            <div className="messenger-container">
            <div className={"messages-container"}>
                <h1>here will be messages</h1>
                <textarea></textarea>
                <button>send</button>
            </div>
                <div className={"message-profile"}>

                </div>
            </div>

        </div>
    );
};

export default Messages;
