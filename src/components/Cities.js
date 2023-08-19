import React, {useEffect, useState} from "react";
import axios from "axios";

const Cities= ({formData}) => {
    let [cities, setCities] = useState([]);

    useEffect(() => {
            function getCities() {
                const headers = {
                    'X-Api-Key': '2NSMNHamzZBFVHUZo/9kIg==B4ZUziZJPNlfUP7Z'
                }
                axios.get('https://api.api-ninjas.com/v1/city?limit=5&name=' + formData.location, {headers: headers})
                    .then(r => setCities(r.data))
            }

            if (formData.location.length >= 3) {
                getCities()
            }
        }, [formData.location]
    );

    return (
        <datalist id="location-list">
            {cities.map((city, index) => (
                <option key={index} value={city.name}>{city.name}</option>
            ))}
        </datalist>
    )
}
export default Cities;
