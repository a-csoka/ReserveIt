import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.css"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"

import Redirect from "./Components/Redirect"

import Panel from "./Components/Login/Panel";
import LoginForm from "./Components/Login/LoginForm"
import RegisterForm from "./Components/Login/RegisterForm"
import ForgottenPasswordForm from "./Components/Login/ForgottenPasswordForm"
import NewPasswordForm from "./Components/Login/NewPasswordForm"
import ConfirmReg from "./Components/Login/ConfirmReg"

import Dashboard from "./Components/Dashboard/Dashboard"

import MyBusinesses from "./Components/Dashboard/MyBusinesses"
import MyBusinessesCreate from './Components/Dashboard/MyBusinesses/Create';
import MyBusinessesList from './Components/Dashboard/MyBusinesses/List';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <Routes>errorMsg
      <Route path="" element={<Redirect/>} />
        <Route path="loginPage" element={<React.Fragment><Redirect onlyCheckLoggedIn={true}/><Panel /></React.Fragment>}>
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="forgottenPassword" element={<ForgottenPasswordForm />} />
          <Route path="newpassword/:Key" element={<NewPasswordForm />} />
          <Route path="verifyAccount/:Key" element={<ConfirmReg />} /> 
          <Route path="*" element={<Redirect/>} />
        </Route>
        <Route path="dashboard" element={<React.Fragment><Redirect onlyCheckWrongLink={false}/><Dashboard/></React.Fragment>}>
          <Route path="mycalendar" />
          <Route path="businesses" />
          <Route path="mybusinesses" element={<MyBusinesses />} > 
            <Route path="list" element={<MyBusinessesList />}/>
            <Route path="create" element={<MyBusinessesCreate />}/>
            <Route path="invites"/>
            <Route path="*" element={<Navigate to="./list"/>}/>
          </Route>
          <Route path="settings" />
          <Route path="*" element={<Redirect onlyCheckWrongLink={true}/>}/>
        </Route>
        <Route path="*" element={<Redirect/>} />
      </Routes>
    </BrowserRouter>
);

//          <Route path='dashboard' element={<MenuBar />} />


