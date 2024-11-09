// import logo from './logo.svg';
// import './App.css';
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Pages/SignupPage";
import Login from "./Pages/LoginPage";
import ForgotPasword from "./Pages/ForgotPassword";
import HomePage from "./Pages/HomePage";
import NoPage from "./Pages/404Page";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<ForgotPasword />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;