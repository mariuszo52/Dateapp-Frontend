import logo from "../images/logo.png"
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import React, {useEffect, useState} from "react";
import axios from "axios";


const Profile = () => {
    const navigate = useNavigate();
    const [cookies,setCookies, removeCookies] =
        useCookies(["UserInfo", "LoggedUserId", "CurrentChat"]);
    const [distance, setDistance] = useState(cookies.UserInfo.maxDistance);

    function handleClick() {
        navigate("/dashboard")
    }

    function handlePersonalInfoButton() {
        navigate("/edit-personal-info")
    }

    function handleLogout() {
        try {
            removeCookies("UserInfo")
            removeCookies("LoggedUserId")
            removeCookies("CurrentChat")
            sessionStorage.clear()
            localStorage.clear()
        } catch (error) {
            console.log(error)
        }
        navigate("/login")

    }

    const handleDistanceChange = (event) => {
        const distance = document.getElementById("distance").value
        setDistance(distance)
        axios.put('http://localhost:8080/distance?distance=' + distance)
    }

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/logged-user-info`);
                setCookies("UserInfo", response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserInfo()
    }, [distance]);
    return (
        <div className="dashboard">
            <div className={"settings-container"}>
                <div className={"profile"}>
                    <img src={logo} alt={"Logo"} onClick={handleClick}/>
                </div>
                <div className={"settings"}>
                    <h1>Settings</h1>
                    <hr></hr>
                    <h2>Max Distance: {distance} km</h2>
                    <input id={"distance"} defaultValue={cookies.UserInfo.maxDistance}
                           name="distance" type="range" min="0" max="500" step="10" onChange={handleDistanceChange}/>
                    <hr></hr>
                    <button onClick={handlePersonalInfoButton} className={"settings-button"}>Personal Info</button>
                    <hr></hr>
                    <h2>Password</h2>
                    <hr></hr>
                    <button onClick={handleLogout} className={"settings-button"}>Logout</button>
                    <hr></hr>
                    <h2>Delete account</h2>
                </div>
            </div>
            <div className={"card-container"}>
                <div className={"profile-card"}>
                    <img src={cookies.UserInfo?.url} alt={"User"}/>
                    <p>{cookies.UserInfo?.firstName} <span>{cookies.UserInfo?.age}</span></p>
                    <hr></hr>
                    <p>{cookies.UserInfo?.locationDto.name}</p>
                    <hr></hr>
                    <p>{cookies.UserInfo?.genderIdentity}</p>
                    <hr></hr>
                    <p>Interested in: {cookies.UserInfo?.genderInterest}</p>
                    <hr></hr>
                    <p>{cookies.UserInfo?.about}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
