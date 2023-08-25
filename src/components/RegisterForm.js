import axios from 'axios';
import {useState} from "react";
import {useNavigate} from 'react-router-dom'
import {useCookies} from "react-cookie";


function RegisterForm() {

    const [, setCookie] = useCookies();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    let navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
            console.log(formData)
            setCookie("RegisterData", formData);
                navigate('/info');
            };
    return (
        <>
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
