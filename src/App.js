import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserInfo from "./pages/UserInfo";
import Dashboard from "./pages/Dashboard";
import {PrivateRoute} from "./components/PrivateRouter";
import Profile from "./pages/Profile";
import LikeProfile from "./pages/LikeProfile";
import Messages from "./pages/Messages";
import axios from "axios";
function App() {
  axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("jwtToken");

  return (
  <BrowserRouter>
    <Routes>
      <Route path={"/"} element={<Home />}></Route>
      <Route path={"/login"} element={<Login />}></Route>
      <Route path={"/info"} element={<UserInfo />}></Route>
      <Route path={"/dashboard"} element={<PrivateRoute><Dashboard /></PrivateRoute>}></Route>
      <Route path={"/profile"} element={<PrivateRoute><Profile /></PrivateRoute>}></Route>
      <Route path={"/like-profile"} element={<PrivateRoute><LikeProfile /></PrivateRoute>}></Route>
      <Route path={"/messages"} element={<PrivateRoute><Messages /></PrivateRoute>}></Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
