import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserInfo from "./pages/UserInfo";
import Dashboard from "./pages/Dashboard";
function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path={"/"} element={<Home />}></Route>
      <Route path={"/login"} element={<Login />}></Route>
      <Route path={"/info"} element={<UserInfo />}></Route>
      <Route path={"/dashboard"} element={<Dashboard />}></Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
