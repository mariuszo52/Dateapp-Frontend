import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import enter from "../images/enter.png";


function PasswordChange() {

    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");


    const handleSubmit = async (event) => {
        event.preventDefault();
        const data ={
            oldPassword,
            newPassword
        }
        await axios.put("http://localhost:8080/new-password", data)
            .then(r => console.log(r))
            .catch(reason => console.log(reason))
        navigate("/profile")
    };

    return (
        <div className={'login-page'}>
            <h1>Change Password</h1>
            <form onSubmit={handleSubmit} className={"register-form"}>
                <label>Old Password</label>
                <input type={"password"} name={"old-password"}
                       value={oldPassword}
                       onChange={event => setOldPassword(event.target.value)}/>
                <label>New Password</label>
                <input type={"password"} name={"new-password"}
                       value={newPassword}
                       onChange={event => setNewPassword(event.target.value)}/>
                <input type={"submit"} name={"submit"}></input>
            </form>
        </div>
    );
}

export default PasswordChange;
