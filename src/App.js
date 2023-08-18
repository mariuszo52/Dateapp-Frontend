import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserInfo from "./pages/UserInfo";
import Dashboard from "./pages/Dashboard";
import {PrivateRoute} from "./components/PrivateRouter";
import Profile from "./pages/Profile";
import LikeProfile from "./pages/LikeProfile";
import Messages from "./pages/Messages";
import EditPersonalInfo from "./pages/EditPersonalInfo";
import axios from "axios";
function App() {
  axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("jwtToken");
  return (
  <BrowserRouter>
    <Routes>
      <Route path={"/"} element={sessionStorage.getItem('jwtToken') ? <Navigate to="/dashboard"/> : <Home />}></Route>
      <Route path={"/dashboard"} element={<PrivateRoute><Dashboard /></PrivateRoute>}></Route>
      <Route path={"/login"} element={sessionStorage.getItem('jwtToken') ? <Navigate to="/dashboard"/> : <Login/>}/>
      <Route path={"/info"} element={sessionStorage.getItem('jwtToken') ? <Navigate to="/dashboard"/> : <UserInfo/>}></Route>
      <Route path={"/profile"} element={<PrivateRoute><Profile /></PrivateRoute>}></Route>
      <Route path={"/like-profile"} element={<PrivateRoute><LikeProfile /></PrivateRoute>}></Route>
      <Route path={"/messages"} element={<PrivateRoute><Messages /></PrivateRoute>}></Route>
      <Route path={"/edit-personal-info"} element={<PrivateRoute><EditPersonalInfo /></PrivateRoute>}></Route>

    </Routes>
  </BrowserRouter>
  );
}

export default App;
