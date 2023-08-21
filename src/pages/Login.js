import {  useState } from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import enter from "../images/enter.png";


function Login() {
    const [cookies, setCookie] = useCookies(["UserInfo", "LoggedUserId"])
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [, setCookies] = useCookies();
    const navigate = useNavigate();

    const fetchUserInfo = async () => {
        try {
            let config = {
                headers: {
                    Authorization: sessionStorage.getItem("jwtToken"),
                }
            }

            const response = await axios.get(`http://localhost:8080/user-info?userId=${cookies.LoggedUserId}`,config);
            console.log("UserInfo" + response.data.location)
            setCookie("UserInfo", response.data)
            navigate("/dashboard")
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/login', credentials);
                let success = response.status === 200;
                if(success) {
                    const data = response.data;
                    setCookies("LoggedUserId", data.userId);
                    sessionStorage.setItem('jwtToken', 'Bearer '.concat(data.jwt));
                }
            } catch (error) {
                console.error(error);
            }
            fetchUserInfo()
        };

    return (
        <div className={'login-page'}>
            <img src={enter} alt={"login"}></img>
            <h1>Log in to your account</h1>
            <form onSubmit={handleSubmit} className={"register-form"}>
                <label>Email</label>
                <input type={"email"} name={"email"}
                       value={credentials.email}
                       onChange={(e) =>
                           setCredentials({...credentials, email: e.target.value})}/>
                <label>Password</label>
                <input type={"password"} name={"password"}
                       value={credentials.password}
                       onChange={(e) =>
                           setCredentials({...credentials, password: e.target.value})}/>
                <input type={"submit"} name={"submit"}></input>
            </form>
            {sessionStorage.getItem('jwtToken')}
        </div>
    );
}

export default Login;
