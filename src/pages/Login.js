import {  useState } from "react";
import axios from "axios";

function Login() {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const jwtToken = sessionStorage.getItem('jwtToken');
        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/login', credentials);
                let success = response.status === 200;
                if(success) {
                    sessionStorage.setItem('jwtToken', response.data);
                    console.log(sessionStorage.getItem('jwtToken'));
                    window.location.href="/info";
                }
            } catch (error) {
                console.error(error);
            }
        };

    return (
        <div>
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
