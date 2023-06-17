import Navigation from "../components/Navigation";
import RegisterForm from "../components/RegisterForm";

function Home() {

    return (
        <div className="overlay">
            <Navigation/>
            <h1>Create new account</h1>
            {<RegisterForm />}
        </div>
    );
}
export default Home;
