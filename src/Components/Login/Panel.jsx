import React, { Component } from 'react';
import { Outlet } from 'react-router';

import "./css/Panel.css";

import PageBtn from "./PageBtn"



class Panel extends Component {
    state = {  } 
    render() { 
        return (
        <React.Fragment>           
            
            <div id="loginDiv">
                <div className="background"></div>
                <Outlet />
                <PageBtn buttonText="Bejelentkezés" left="25%" top="15%" redirect="/"/>
                <PageBtn buttonText="Regisztráció"  right="25%" top="15%" redirect="/register"/>
            </div>

        </React.Fragment>);
    }
}
 
export default Panel;
