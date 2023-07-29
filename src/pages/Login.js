import {  useState } from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import enter from "../images/enter.png";


function Login() {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [, setCookies] = useCookies();
    const navigate = useNavigate();
    const jwtToken = sessionStorage.getItem('jwtToken');
        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/login', credentials);
                let success = response.status === 200;
                if(success) {
                    const data = response.data;
                    setCookies("LoggedUserId", data.userId);
                    sessionStorage.setItem('jwtToken', 'Bearer '.concat(data.jwt));
                    axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("jwtToken");
                    navigate("/dashboard")
                }
            } catch (error) {
                console.error(error);
            }
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
            <h1>{jwtToken}</h1>
        </div>
    );
}

export default Login;
