import { Navigate } from 'react-router-dom';

export function LoggedUserRoute({ children }) {
    if (sessionStorage.getItem('jwtToken')) {
        return <Navigate to="/dashboard" />;
    }
    return children;
}
