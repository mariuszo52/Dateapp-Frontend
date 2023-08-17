import {  useState } from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";


function EditPersonalInfo() {
    const [cookies, setCookies] = useCookies(["UserInfo"]);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: cookies.UserInfo.firstName,
        location: cookies.UserInfo.location,
        dayOfBirth: cookies.UserInfo.dayOfBirth,
        monthOfBirth: cookies.UserInfo.monthOfBirth,
        yearOfBirth: cookies.UserInfo.yearOfBirth,
        url: cookies.UserInfo.url,
        about: cookies.UserInfo.about,
    });
    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put('http://localhost:8080/user-info-edit', formData);
            let success = response.status === 201;
            if(success) {
                setCookies("UserInfo", response.data)
            navigate("/profile")
            }
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div className={'onboarding'}>
            <form onSubmit={handleSubmit}>
                <section>
                    <label htmlFor="firstName">First Name</label>
                    <input
                        id="firstName"
                        type='text'
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    <label htmlFor="location">Location</label>
                    <input
                        id="location"
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                    <label>Birthday</label>
                    <div className="multiple-input-container">
                        <input
                            id="dayOfBirth"
                            type="number"
                            name="dayOfBirth"
                            placeholder="DD"
                            value={formData.dayOfBirth}
                            onChange={handleChange}
                            min={1}
                            max={31}
                        />

                        <input
                            id="monthOfBirth"
                            type="number"
                            name="monthOfBirth"
                            placeholder="MM"
                            value={formData.monthOfBirth}
                            onChange={handleChange}
                            min={1}
                            max={12}
                        />

                        <input
                            id="yearOfBirth"
                            type="number"
                            name="yearOfBirth"
                            placeholder="YYYY"
                            value={formData.yearOfBirth}
                            onChange={handleChange}
                            min={1950}
                            max={new Date().getFullYear() - 18}
                        />
                    </div>
                    <label htmlFor="about">About me</label>
                    <input
                        id="about"
                        type="text"
                        name="about"
                        value={formData.about}
                        onChange={handleChange}
                    />

                    <input type="submit"/>
                </section>

                <section>
                    <label htmlFor="url">Profile Photo</label>
                    <input
                        type="url"
                        name="url"
                        id="url"
                        value={formData.url}
                        onChange={handleChange}
                    />
                    <div className="photo-container">
                        {formData.url && <img src={formData.url} alt="profile pic preview"/>}
                    </div>

                </section>

            </form>
        </div>
    );
}

export default EditPersonalInfo;
