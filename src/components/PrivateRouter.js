import { Navigate } from 'react-router-dom';

export function PrivateRoute({ children }) {
    if (!sessionStorage.getItem('jwtToken')) {
        console.log(localStorage.getItem("jwtToken"))
        return <Navigate to="/login" />;
    }

    return children;
}
