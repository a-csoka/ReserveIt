import React, { Component } from 'react';

import "./css/Panel.css";

import calendarBg from "./images/background.jpg"
import InputPlus from "./Inputs"



class Panel extends Component {
    state = {  } 
    render() { 
        return (
        <React.Fragment>
            <img src={calendarBg} className='calendarBg' alt="Hiba a betöltés során!"></img>
            <div id="loginDiv">
                <div className="background"></div>
                <InputPlus left="15%" width="21vw" top="32.5%" height="3.25vh"  type="text" placeholder="Email" imageSrc="Email"/>
                <InputPlus left="15%" width="21vw" top="47.5%" height="3.25vh" type="password" placeholder="Jelszó" imageSrc="Key"/>
                
                <button className='loginBtn rounded-pill'>Bejelentkezés</button>
                <button className='forgotBtn'>Elfelejtette a jelszavát?</button>
            </div>

        </React.Fragment>);
    }
}
 
export default Panel;
