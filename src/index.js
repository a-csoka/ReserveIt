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

import CalendarMain from "./Components/Dashboard/Calendar/Main"
import CalendarCalendar from "./Components/Dashboard/Calendar/Calendar"
import CalendarNotifications from "./Components/Dashboard/Calendar/Notifications"

import Businesses from "./Components/Dashboard/Businesses"
import MyBusinesses from "./Components/Dashboard/MyBusinesses"
import MyBusinessesCreate from './Components/Dashboard/MyBusinesses/Create';
import MyBusinessesList from './Components/Dashboard/MyBusinesses/List';
import MyBusinessesInvites from './Components/Dashboard/MyBusinesses/Invites';
import Settings from "./Components/Dashboard/Settings"

import BusinessManage from './Components/BusinessManage/BusinessManage';
import BusinessWorkers from './Components/BusinessManage/Workers';
import BusinessCalendar from './Components/BusinessManage/Calendar'
import BusinessSettings from './Components/BusinessManage/Settings'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <Routes>
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
          <Route path="mycalendar" element={<CalendarMain />}>
            <Route path="calendar" element={<CalendarCalendar/>}/>
            <Route path="notifications" element={<CalendarNotifications />}/>
            <Route path="*" element={<Navigate to="./calendar"/>}/>
          </Route>
          <Route path="businesses" element={<Businesses />}/>
          <Route path="mybusinesses" element={<MyBusinesses />} > 
            <Route path="list" element={<MyBusinessesList />}/>
            <Route path="create" element={<MyBusinessesCreate />}/>
            <Route path="invites" element={<MyBusinessesInvites/>}/>
            <Route path="*" element={<Navigate to="./list"/>}/>
          </Route>
          <Route path="settings" element={<Settings />}/>
          <Route path="*" element={<Navigate to="./mycalendar"/>}/>
        </Route>
        <Route path="BusinessManage/:BusinessID" element={<React.Fragment><Redirect onlyCheckWrongLink={false}/><BusinessManage /></React.Fragment>}> 
          <Route path="calendar" element={<BusinessCalendar/>}/>
          <Route path="workers" element={<BusinessWorkers/>}/>
          <Route path="settings" element={<BusinessSettings/>}/>
          <Route path="exit" element={<Navigate to="../../dashboard/mybusinesses/list"/>}/>
          <Route path="*" element={<Navigate to="./calendar"/>}/>
        </Route>
        <Route path="*" element={<Redirect/>} />
      </Routes>
    </BrowserRouter>
);


