import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";


function DeleteAccount() {

    const navigate = useNavigate();
    const [,,removeCookie] = useCookies(["LoggedUserId", "UserInfo", "CurrentChat"]);
    const [password, setPassword] = useState("");
    function logout(){
        sessionStorage.clear();
        localStorage.clear();
        removeCookie("UserInfo")
        removeCookie("LoggedUserId")
        removeCookie("CurrentChat")
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await axios.delete("http://localhost:8080/delete-account", { params: {
                password
            }})
            .then(r => console.log(r))
            .catch(reason => console.log(reason))
        logout()
        navigate("/")
    };

    return (
        <div className={'login-page'}>
            <h1>Insert your password for submit account delete.</h1>
            <form onSubmit={handleSubmit} className={"register-form"}>
                <label>Password</label>
                <input type={"password"} name={"password"}
                       value={password}
                       onChange={event => setPassword(event.target.value)}/>
                <input type={"submit"} name={"submit"}></input>
            </form>
        </div>
    );
}

export default DeleteAccount;
