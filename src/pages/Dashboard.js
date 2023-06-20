

function Home() {

    return (
        <div>
            {sessionStorage.getItem('jwtToken')}
        </div>
    );
}
export default Home;
