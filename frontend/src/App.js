// import logo from './logo.svg';
// import './App.css';
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Pages/SignupPage.jsx";
import Login from "./Pages/LoginPage.jsx";
import ForgotPasword from "./Pages/ForgotPassword.jsx";
import AppLayout from "./Components/Layout/AppLayout.jsx";
import NoPage from "./Pages/404Page.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import History from "./Components/History.jsx";
import Settings from "./Components/Settings";
import LandingPage from "./Pages/LandingPage.jsx";
import TargetInfo from "./Pages/TargetInfo";
import Subdomain from "./Pages/Subdomain";
import IPandPorts from "./Pages/IPandPorts";
import { NotificationProvider } from "./contexts/NotificationContext";
import PrivateRoute from "../src/Authorization/PrivateRoute.jsx";
import AssetEnumeration from "./Pages/AssetEnumeration.jsx";
import PentestingTools from "./Pages/PentestingTools.jsx";
import SipCalc from "./Pages/SipCalc.jsx";
import CVE from "./Pages/CVE.jsx";
import PasswordCracking from "./Pages/PasswordCrack.jsx";
import { ThemeProvider } from "./contexts/theme/ThemeContext.jsx";

function App() {
  return (
    <div>
      <BrowserRouter
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true
        }}
      >
        <ThemeProvider>
          <NotificationProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgotpassword" element={<ForgotPasword />} />
              <Route element={<PrivateRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/:domain/targetinfo" element={<TargetInfo />} />
                  <Route path="/:domain/subdomainenumeration" element={<Subdomain />} />
                  <Route path="/:domain/ipandports" element={<IPandPorts />} />
                  <Route path="/:domain/assetenumeration" element={<AssetEnumeration />} />
                  <Route path="/:domain/pentestingtools" element={<PentestingTools />} />
                  <Route path="/:domain/pentestingtools/sipcalc" element={<SipCalc />} />
                  <Route path="/:domain/cvereporting" element={<CVE />} />
                  <Route path="/:domain/passwordcracking" element={<PasswordCracking />} />
                </Route>
              </Route>
              <Route path="*" element={<NoPage />} />
            </Routes>
          </NotificationProvider>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;