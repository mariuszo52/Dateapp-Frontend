import axios from "axios";
import { useState } from "react";
import { useLocation } from 'react-router-dom';
const UserInfo = () => {
        const location = useLocation();
        const userId = location.state?.userId;

    const [formData, setFormData] = useState({
        firstName: "",
        dayOfBirth: "",
        monthOfBirth: "",
        yearOfBirth: "",
        showGender: false,
        genderIdentity: "man",
        genderInterest: "woman",
        url: "",
        about: "",
        userId: userId
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
                window.location.href = "/login";
            })
            .catch((error) => {
                console.log(error);
            });
    };
        return (
            <>
            <div className="onboarding">
                <h2>CREATE ACCOUNT</h2>

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
                            <input
                                id="moreGenderIdentity"
                                type="radio"
                                name="genderIdentity"
                                value="more"
                                onChange={handleChange}
                                checked={formData.genderIdentity === "more"}
                            />
                            <label htmlFor="moreGenderIdentity">More</label>
                        </div>

                        <label htmlFor="showGender">Show Gender on my Profile</label>

                        <input
                            id="showGender"
                            type="checkbox"
                            name="showGender"
                            onChange={handleChange}
                            checked={formData.showGender}
                        />

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
                            <input
                                id="everyoneGenderInterest"
                                type="radio"
                                name="genderInterest"
                                value="everyone"
                                onChange={handleChange}
                                checked={formData.genderInterest === "everyone"}
                            />
                            <label htmlFor="everyoneGenderInterest">Everyone</label>

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
