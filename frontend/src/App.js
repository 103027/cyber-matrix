// import logo from './logo.svg';
// import './App.css';
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Pages/SignupPage.jsx";
import Login from "./Pages/LoginPage.jsx";
import ForgotPasword from "./Pages/ForgotPassword.jsx";
import AppLayout from "./Components/Layout/AppLayout.jsx";
import NoPage from "./Pages/404Page";
import Home from "./Pages/Homepage/Home";
import Dashboard from "./Components/Dashboard.jsx";
import History from "./Components/History";
import Settings from "./Components/Settings";
import LandingPage from "./Pages/LandingPage.jsx";
import TargetInfo from "./Components/TargetInfo";
import Subdomain from "./Components/Subdomain";
import IPandPorts from "./Components/IPandPorts";
import { TargetInfoProvider } from "./contexts/TargetInfoContext.jsx";
import { SubdomainProvider } from "./contexts/SubdomainContext.jsx";
import { NotificationProvider } from "./contexts/NotificationContext";
import { IPandPortsProvider } from "./contexts/IPandPortsContext.jsx";
import PrivateRoute from "../src/Authorization/PrivateRoute.jsx";

function App() {
  return (
    <div>
      <BrowserRouter>
        <NotificationProvider>
          <IPandPortsProvider>
            <TargetInfoProvider>
              <SubdomainProvider>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgotpassword" element={<ForgotPasword />} />
                  <Route element={<PrivateRoute />}>
                    <Route element={<AppLayout />}>
                      <Route path="/home" element={<Home />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/:domain/targetinfo" element={<TargetInfo />} />
                      <Route path="/:domain/subdomainenumeration" element={<Subdomain />} />
                      <Route path="/:domain/ipandports" element={<IPandPorts />} />
                    </Route>
                  </Route>
                  <Route path="*" element={<NoPage />} />
                </Routes>
              </SubdomainProvider>
            </TargetInfoProvider>
          </IPandPortsProvider>
        </NotificationProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;