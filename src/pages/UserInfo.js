import axios from "axios";

const UserInfo = () => {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const handleClick = () => {
        axios.get('http://localhost:8080/auth', {
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <div>
            <button onClick={handleClick}>Wyślij żądanie</button>
        </div>
    );
};

export default UserInfo;
