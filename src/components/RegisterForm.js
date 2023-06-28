import axios from 'axios';
import {useState} from "react";
import {useNavigate} from 'react-router-dom'
import {useCookies} from "react-cookie";


function RegisterForm() {

    const [message, setMessage] = useState(null);
    const [, setCookie] = useCookies(["LoggedUserId"]);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });
    let navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/register', formData);
            const success = response.status === 201
            if (success) {
                console.log("response".concat(response.data))
                setCookie("LoggedUserId", response.data)
                navigate('/info');

            }
        } catch (err) {
            setMessage(err.response.data)
            console.log(message);
        }

    };
    return (
        <>
            {message && <p className="notification">{message}</p>}
            <form onSubmit={handleSubmit} className={"register-form"}>
                <label>Email</label>
                <input type={"email"} name={"email"}
                       value={formData.email}
                       onChange={(e) =>
                           setFormData({...formData, email: e.target.value})}/>
                <label>Password</label>
                <input type={"password"} name={"password"}
                       value={formData.password}
                       onChange={(e) =>
                           setFormData({...formData, password: e.target.value})}/>
                <label>Confirm password</label>
                <input type={"password"}
                       value={formData.confirmPassword}
                       name={"confirmPassword"}
                       onChange={(e) =>
                           setFormData({...formData, confirmPassword: e.target.value})}/>
                <input type={"submit"} name={"submit"}></input>
            </form>
        </>
    );
}

export default RegisterForm;
