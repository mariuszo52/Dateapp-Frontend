import axios from "axios";
import React, {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {useNavigate} from 'react-router-dom'


const UserInfo = () => {

    const [cookies, , removeCookies] = useCookies(["LoggedUserId", "RegisterData"])
    let [cities, setCities] = useState([]);
    const [notification, setNotification] = useState("");
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        firstName: "",
        locationDto: {
            name: "",
            latitude: "",
            longitude: "",
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
    const userRegisterDto = {
        ...cookies.RegisterData,
        userInfo: userInfo
    };
    const handleChange = (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        const name = e.target.name;

        if (name.startsWith("locationDto.")) {
            const locationDtoField = name.split(".")[1];
            setUserInfo((prevState) => ({
                ...prevState,
                locationDto: {
                    ...prevState.locationDto,
                    [locationDtoField]: value,
                },
            }));
        } else {
            setUserInfo((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        await axios.post('http://localhost:8080/register', userRegisterDto)
            .then(r => removeCookies("RegisterData"))
        navigate('/login');
    };


    useEffect(() => {
            function getCities() {
                console.log(userInfo.locationDto.name)

                const headers = {
                    'X-Api-Key': '2NSMNHamzZBFVHUZo/9kIg==B4ZUziZJPNlfUP7Z'
                }
                axios.get('https://api.api-ninjas.com/v1/city?limit=5&name=' + userInfo.locationDto.name, {headers: headers})
                    .then(r => {
                        setCities(r.data)
                        r.data.length === 0 ? setNotification("City not found. Please select location from list.") : setNotification(null)
                        console.log(r.data)
                        setUserInfo(prevuserInfo => ({
                            ...prevuserInfo,
                            locationDto: {
                                ...prevuserInfo.locationDto,
                                latitude: r.data[0]?.latitude,
                                longitude: r.data[0]?.longitude,
                                country: r.data[0]?.country
                            }
                        }))
                    })
            }


            if (userInfo.locationDto.name?.length >= 3) {
                getCities()
            }
        }, [userInfo.locationDto.name]
    );

    return (
        <>
            <div className="onboarding">
                {notification &&(<h3 id={"notification"} className={"notification"}>{notification}</h3>)}
                <form onSubmit={handleSubmit}>
                    <section>
                        <label htmlFor="firstName">First Name</label>
                        <input
                            id="firstName"
                            type='text'
                            name="firstName"
                            placeholder="First Name"
                            required={true}
                            value={userInfo.firstName}
                            onChange={handleChange}
                            minLength={1}
                        />
                        <label htmlFor="locationDtoName">location</label>
                        <input
                            type="text"
                            placeholder="Warsaw"
                            id="locationDtoName"
                            name="locationDto.name"
                            list="locationDto-list"
                            required={true}
                            value={userInfo.locationDto.name}
                            onChange={handleChange}
                            minLength={1}
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
                                required={true}
                                value={userInfo.dayOfBirth}
                                onChange={handleChange}
                                min={1}
                                max={31}
                            />

                            <input
                                id="monthOfBirth"
                                type="number"
                                name="monthOfBirth"
                                placeholder="MM"
                                required={true}
                                value={userInfo.monthOfBirth}
                                onChange={handleChange}
                                min={1}
                                max={12}
                            />

                            <input
                                id="yearOfBirth"
                                type="number"
                                name="yearOfBirth"
                                placeholder="YYYY"
                                required={true}
                                value={userInfo.yearOfBirth}
                                onChange={handleChange}
                                min={1950}
                                max={2005}
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
                                checked={userInfo.genderIdentity === "man"}
                            />
                            <label htmlFor="manGenderIdentity">Man</label>
                            <input
                                id="womanGenderIdentity"
                                type="radio"
                                name="genderIdentity"
                                value="woman"
                                onChange={handleChange}
                                checked={userInfo.genderIdentity === "woman"}
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
                                checked={userInfo.genderInterest === "man"}
                            />
                            <label htmlFor="manGenderInterest">Man</label>
                            <input
                                id="womanGenderInterest"
                                type="radio"
                                name="genderInterest"
                                value="woman"
                                onChange={handleChange}
                                checked={userInfo.genderInterest === "woman"}
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
                            value={userInfo.about}
                            onChange={handleChange}
                            minLength={1}
                            maxLength={1000}
                        />

                        {!notification && (<input type="submit"/>)}
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
                            {userInfo.url && <img src={userInfo.url} alt="profile pic preview"/>}
                        </div>


                    </section>

                </form>
            </div>
        </>
    );
};

export default UserInfo;
