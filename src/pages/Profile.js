import logo from "../images/logo.png"
import {useNavigate} from "react-router-dom";
import { useCookies } from "react-cookie";


const Profile = () => {
    const navigate = useNavigate();
    const [ cookies ] = useCookies(["UserInfo"]);

 function handleClick(){
     navigate("/dashboard")
 }
 console.log(cookies.UserInfo)

    return (
        <div className="dashboard">
            <div className={"settings-container"}>
                <div className={"profile"}>
                    <img src={logo} alt={"Logo"} onClick={handleClick}/>
                </div>
                <div className={"settings"}>
                    <h1>Settings</h1>
                    <hr></hr>
                    <h2>Email</h2>
                    <hr></hr>
                    <h2>Password</h2>
                    <hr></hr>
                    <h2>Logout</h2>
                    <hr></hr>
                    <h2>Delete account</h2>
                </div>
            </div>
            <div className={"card-container"}>
                <div className={"profile-card"}>
                    <img src={cookies.UserInfo?.url} alt={"User"}/>
                    <p>{cookies.UserInfo?.firstName} <span>{cookies.UserInfo?.age}</span></p>
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
