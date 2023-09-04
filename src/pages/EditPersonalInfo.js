import React, {useEffect, useState} from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";


function EditPersonalInfo() {
    const [cookies] = useCookies(["UserInfo"]);
    let [cities, setCities] = useState([]);
    const navigate = useNavigate();
    const [notification, setNotification] = useState("");
    const [formData, setFormData] = useState({
        firstName: cookies.UserInfo.firstName,
        locationName: cookies.UserInfo.locationDto?.name,
        locationLatitude: cookies.UserInfo.locationDto?.latitude,
        locationLongitude: cookies.UserInfo.locationDto?.longitude,
        locationCountry: cookies.UserInfo.locationDto?.country,
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

    useEffect(() => {
            function getCities() {
                console.log(formData.locationName)

                const headers = {
                    'X-Api-Key': '2NSMNHamzZBFVHUZo/9kIg==B4ZUziZJPNlfUP7Z'
                }
                axios.get('https://api.api-ninjas.com/v1/city?limit=5&name=' + formData.locationName, {headers: headers})
                    .then(r => {
                        setCities(r.data)
                        r.data.length === 0 ? setNotification("City not found. Please select location from list.") : setNotification(null)
                        setFormData(prevFormData => ({
                            ...prevFormData,
                            locationLatitude: r.data[0]?.latitude,
                            locationLongitude: r.data[0]?.longitude,
                            locationCountry: r.data[0]?.country
                        }));
                    })

            }


            if (formData.locationName?.length >= 3) {
                getCities()
            }
        }, [formData.locationName]
    );


    const handleSubmit = (event) => {
        event.preventDefault();
        axios
            .put("http://localhost:8080/user-info-edit", formData)
            .then((r) => setNotification("User info edited."))
            .catch((error) => {
                setNotification("User info edit failed.")
                console.log(error);
            });
        navigate("/profile")
    };


    return (
        <div className={'onboarding'}>
            {notification &&(<h3 id={"notification"} className={"notification"}>{notification}</h3>)}
            <form onSubmit={handleSubmit}>
                <section>
                    <label htmlFor="firstName">First Name</label>
                    <input
                        id="firstName"
                        type='text'
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        minLength={3}
                    />
                    <label htmlFor="locationName">location</label>
                    <input
                        type="text"
                        placeholder="Warsaw"
                        id="locationName"
                        name="locationName"
                        list="locationDto-list"
                        required={true}
                        value={formData.locationName}
                        onChange={handleChange}
                        minLength={3}
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
                        minLength={1}
                        maxLength={1000}
                        id="about"
                        type="text"
                        name="about"
                        value={formData.about}
                        onChange={handleChange}
                    />
                    {!notification && (<input type="submit"/>)}
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
