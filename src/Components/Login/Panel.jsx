import React, { Component } from 'react';

import "./css/Panel.css";

import PageBtn from "./PageBtn"
import LoginForm from "./LoginForm"



class Panel extends Component {
    state = {  } 
    render() { 
        return (
        <React.Fragment>           
            
            <div id="loginDiv">
                <div className="background"></div>
                <LoginForm/>
                <PageBtn buttonText="Bejelentkezés" left="25%" top="15%"/>
                <PageBtn buttonText="Regisztráció"  right="25%" top="15%"/>
            </div>

        </React.Fragment>);
    }
}
 
export default Panel;
