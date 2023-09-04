import {useCookies} from "react-cookie";
import UserPanel from "../components/UserPanel";


const LikeProfile = () => {
    let [cookies] = useCookies(["profile"]);
    return (
        <div className="dashboard">
            <UserPanel/>
            <div className={"card-container"}>
                <div className={"profile-card"}>
                    <img src={cookies.profile.url} alt={"User"}/>
                    <p>{cookies.profile.firstName} <span>{cookies.profile.age}</span></p>
                    <hr></hr>
                    <p>{cookies.profile.locationDto.name}</p>
                    <hr></hr>
                    <p>{cookies.profile.genderIdentity}</p>
                    <hr></hr>
                    <p>Interested in: {cookies.profile.genderInterest}</p>
                    <hr></hr>
                    <p>{cookies.profile.about}</p>
                </div>
            </div>
        </div>
    );
};

export default LikeProfile;
