import React, {useEffect, useState} from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import Cities from "../components/Cities";


function EditPersonalInfo() {
    const [cookies, setCookies] = useCookies(["UserInfo"]);
    const navigate = useNavigate();
    let [cities, setCities] = useState([]);
    const [formData, setFormData] = useState({
        firstName: "",
        locationDto: {
            name: "",
            latitude:"",
            longitude:"",
            country: ""
        },
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

        if (name.startsWith("locationDto.")) {
            const locationDtoField = name.split(".")[1];
            setFormData((prevState) => ({
                ...prevState,
                locationDto: {
                    ...prevState.locationDto,
                    [locationDtoField]: value,
                },
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    useEffect(() => {
            function getCities() {
                console.log(formData.locationDto.name)

                const headers = {
                    'X-Api-Key': '2NSMNHamzZBFVHUZo/9kIg==B4ZUziZJPNlfUP7Z'
                }
                axios.get('https://api.api-ninjas.com/v1/city?limit=5&name=' + formData.locationDto.name, {headers: headers})
                    .then(r => {
                        setCities(r.data)

                        setFormData(prevFormData => ({
                            ...prevFormData,
                            locationDto: {
                                ...prevFormData.locationDto,
                                latitude: r.data[0].latitude,
                                longitude: r.data[0].longitude,
                                country: r.data[0].country
                            }
                        }));
                    })}



            if (formData.locationDto.name?.length >= 3) {
                getCities()
            }
        }, [formData.locationDto.name]
    );


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
                    <label htmlFor="locationDtoName">location</label>
                    <input
                        type="text"
                        placeholder="Warsaw"
                        id="locationDtoName"
                        name="locationDto.name"
                        list="locationDto-list"
                        required={true}
                        value={formData.locationDto.name}
                        onChange={handleChange}
                    />
                    <datalist id="locationDto-list">
                        {cities.map((city, index) => (
                            <option key={index} value={city.name}>{city.name}</option>
                        ))}
                    </datalist>

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
