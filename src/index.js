import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import "../node_modules/bootstrap/dist/css/bootstrap.css"


import Panel from "./Components/Login/Panel";
import LoginForm from "./Components/Login/LoginForm"
import RegisterForm from "./Components/Login/RegisterForm"
import ForgottenPasswordForm from "./Components/Login/ForgottenPasswordForm"
import NewPasswordForm from "./Components/Login/NewPasswordForm"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <Routes>
      <Route path="" element={<Navigate to="/login"/>} />
        <Route path="/" element={<Panel />}>
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="forgottenPassword" element={<ForgottenPasswordForm />} />
          <Route path="newpassword" element={<NewPasswordForm />} > 
            <Route path="*" />
          </Route>
          <Route path="*" element={<Navigate to="/login"/>} />
        </Route>
      </Routes>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
