import axios from "axios";
import { useState } from "react";
import {useCookies} from "react-cookie";


const UserInfo = () => {

    const [cookies, setCookies] = useCookies(["LoggedUserId", "UserInfo" ])

    const [formData, setFormData] = useState({
        firstName: "",
        location: "",
        dayOfBirth: "",
        monthOfBirth: "",
        yearOfBirth: "",
        genderIdentity: "man",
        genderInterest: "woman",
        url: "",
        about: "",
        userId: cookies.LoggedUserId
    });

    const handleChange = (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        const name = e.target.name;

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        axios
            .post("http://localhost:8080/userinfo", formData)
            .then((response) => {
                setCookies("UserInfo", formData);
                window.location.href = "/login";
            })
            .catch((error) => {
                console.log(error);
            });
    };
        return (
            <>
            <div className="onboarding">
                <form onSubmit={handleSubmit}>
                    <section>
                        <label htmlFor="firstName">First Name</label>
                        <input
                            id="firstName"
                            type='text'
                            name="firstName"
                            placeholder="First Name"
                            required={true}
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        <label htmlFor="location">Location</label>
                        <input
                            id="location"
                            type="text"
                            name="location"
                            required={true}
                            placeholder="Warsaw"
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
                                required={true}
                                value={formData.dayOfBirth}
                                onChange={handleChange}
                            />

                            <input
                                id="monthOfBirth"
                                type="number"
                                name="monthOfBirth"
                                placeholder="MM"
                                required={true}
                                value={formData.monthOfBirth}
                                onChange={handleChange}
                            />

                            <input
                                id="yearOfBirth"
                                type="number"
                                name="yearOfBirth"
                                placeholder="YYYY"
                                required={true}
                                value={formData.yearOfBirth}
                                onChange={handleChange}
                            />
                        </div>

                        <label>Gender</label>
                        <div className="multiple-input-container">
                            <input
                                id="manGenderIdentity"
                                type="radio"
                                name="genderIdentity"
                                value="man"
                                onChange={handleChange}
                                checked={formData.genderIdentity === "man"}
                            />
                            <label htmlFor="manGenderIdentity">Man</label>
                            <input
                                id="womanGenderIdentity"
                                type="radio"
                                name="genderIdentity"
                                value="woman"
                                onChange={handleChange}
                                checked={formData.genderIdentity === "woman"}
                            />
                            <label htmlFor="womanGenderIdentity">Woman</label>
                        </div>

                        <label>Show Me</label>

                        <div className="multiple-input-container">
                            <input
                                id="manGenderInterest"
                                type="radio"
                                name="genderInterest"
                                value="man"
                                onChange={handleChange}
                                checked={formData.genderInterest === "man"}
                            />
                            <label htmlFor="manGenderInterest">Man</label>
                            <input
                                id="womanGenderInterest"
                                type="radio"
                                name="genderInterest"
                                value="woman"
                                onChange={handleChange}
                                checked={formData.genderInterest === "woman"}
                            />
                            <label htmlFor="womanGenderInterest">Woman</label>

                        </div>

                        <label htmlFor="about">About me</label>
                        <input
                            id="about"
                            type="text"
                            name="about"
                            required={true}
                            placeholder="I like long walks..."
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
                            onChange={handleChange}
                            required={true}
                        />
                        <div className="photo-container">
                            {formData.url && <img src={formData.url} alt="profile pic preview"/>}
                        </div>


                    </section>

                </form>
            </div>
                </>
        );
    };

export default UserInfo;
