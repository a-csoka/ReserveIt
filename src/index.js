import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.css"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"


import Panel from "./Components/Login/Panel";
import LoginForm from "./Components/Login/LoginForm"
import RegisterForm from "./Components/Login/RegisterForm"
import ForgottenPasswordForm from "./Components/Login/ForgottenPasswordForm"
import NewPasswordForm from "./Components/Login/NewPasswordForm"
import ConfirmReg from "./Components/Login/confirmReg"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <Routes>
      <Route path="" element={<Navigate to="/login"/>} />
        <Route path="/" element={<Panel />}>
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="forgottenPassword" element={<ForgottenPasswordForm />} />
          <Route path="newpassword/:Key" element={<NewPasswordForm />} />
          <Route path="verifyAccount/:Key" element={<ConfirmReg />} /> 
          <Route path="*" element={<Navigate to="/login"/>} />
        </Route>
      </Routes>
    </BrowserRouter>
);

