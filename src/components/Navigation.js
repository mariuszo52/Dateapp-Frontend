import logo from "../images/logo.png"
const Navigation = () => {
    function handleButton(){
        window.location.href = "/login"
    }
    return (
        <nav>
            <div className={"logo-container"}>
                <img
                    className={"logo"}
                    src={logo}
                    alt={"logo"}/>
            </div>
            <button className={"nav-button"} onClick={handleButton}>Login</button>
        </nav>
    )
}
export default Navigation;
