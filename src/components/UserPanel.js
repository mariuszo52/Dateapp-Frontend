import {useCookies} from "react-cookie";
import {useEffect, useState} from "react";
import axios from "axios";


const UserPanel = () => {
    const [cookies,setCookie] = useCookies(["LoggedUserId", "UserInfo"])
    const [, setUserInfo] = useState(cookies.UserInfo);
    const [currentDiv,setCurrentDiv] = useState("matches");
    const [likes,setLikes] = useState([]);
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: sessionStorage.getItem("jwtToken"),
                    },
                };

                const response = await axios.get(
                    `http://localhost:8080/userinfo?userId=${cookies.LoggedUserId}`,
                    config
                );
                setUserInfo(response.data);
                setCookie("UserInfo", response.data);
            } catch (error) {
                console.error("Wystąpił błąd podczas pobierania danych użytkownika:", error);
            }
        };

        fetchUserInfo();
    }, [cookies.LoggedUserId, setCookie, setUserInfo]);


    const handleButtonLikesClick = async (divId) => {
        try {
            const config = {
                headers: {
                    Authorization: sessionStorage.getItem('jwtToken')
                },
            };

            let response = await axios.get('http://localhost:8080/likes-received?userId='
                .concat(cookies.LoggedUserId), config);
            setLikes(response.data)
        } catch (error) {
            console.error(error);
        }
        setCurrentDiv(divId);
    };
    const handleButtonMatchesClick = (divId) => {
        setCurrentDiv(divId);
    };

    return (
        //doodac do spanów z matchy hrefy
            <div className={"user-panel"}>
                <div className={"profile"}>
                    <img src={cookies.UserInfo?.url} alt={"User"}></img>
                    <h2>{cookies.UserInfo?.firstName}</h2>
                </div>

                <div className={'change-section'}>
                    <button onClick={() => handleButtonMatchesClick("matches")} className={'section-button'}>Matches
                    </button>
                    <button className={'section-button'}>Messages</button>
                    <button onClick={() => handleButtonLikesClick("likes")} className={'section-button'}>Likes</button>
                </div>
                {currentDiv === "likes" && (
                    <div className={"matches"} id={"likes"}>
                        <ul>
                            {likes.map((like, index) => (
                                <li
                                    className={"match-card"}
                                    key={index}
                                    style={{backgroundImage: `url(${like.userUrl})`}}>
                                    <span>{like.userFirstName}</span>

                                </li>


                            ))}
                        </ul>
                    </div>
                )}
                {currentDiv === "matches" && (
                    <div className={"matches"} id={"matches"}>
                        <ul>
                            <li className={"match-card"}>
                                <span>Matches</span>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
    )
}
export default UserPanel;
