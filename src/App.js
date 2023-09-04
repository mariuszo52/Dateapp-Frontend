import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserInfo from "./pages/UserInfo";
import Dashboard from "./pages/Dashboard";
import {PrivateRoute} from "./components/PrivateRouter";
import Profile from "./pages/Profile";
import LikeProfile from "./pages/LikeProfile";
import Messages from "./pages/Messages";
import EditPersonalInfo from "./pages/EditPersonalInfo";
import {LoggedUserRoute} from "./components/LoggedUserRoute";
import axios from "axios";
import PasswordChange from "./pages/PasswordChange";
import DeleteAccount from "./pages/DeleteAccount";
function App() {
  axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("jwtToken");
  return (
  <BrowserRouter>
    <Routes>
      <Route path={"/"} element={<LoggedUserRoute><Home /></LoggedUserRoute>}></Route>
      <Route path={"/dashboard"} element={<PrivateRoute><Dashboard /></PrivateRoute>}></Route>
      <Route path={"/login"} element={<LoggedUserRoute><Login /></LoggedUserRoute>}></Route>
      <Route path={"/info"} element={<LoggedUserRoute><UserInfo /></LoggedUserRoute>}></Route>
      <Route path={"/profile"} element={<PrivateRoute><Profile /></PrivateRoute>}></Route>
      <Route path={"/like-profile"} element={<PrivateRoute><LikeProfile /></PrivateRoute>}></Route>
      <Route path={"/messages"} element={<PrivateRoute><Messages /></PrivateRoute>}></Route>
      <Route path={"/edit-personal-info"} element={<PrivateRoute><EditPersonalInfo /></PrivateRoute>}></Route>
      <Route path={"/new-password"} element={<PrivateRoute><PasswordChange/></PrivateRoute>}></Route>
      <Route path={"/delete-account"} element={<PrivateRoute><DeleteAccount/></PrivateRoute>}></Route>

    </Routes>
  </BrowserRouter>
  );
}

export default App;
