import React, { Component } from 'react';

import "./css/Panel.css";

import InputPlus from "./InputPlus"
import PageBtn from "./PageBtn"



class Panel extends Component {
    state = {  } 
    render() { 
        return (
        <React.Fragment>           
            
            <div id="loginDiv">
                <div className="background"></div>
                <div className='forgotWrapper'>
                    <div className='forgotBtn'>Elfelejtette a jelszavát?</div>
                </div>
                <PageBtn buttonText="Bejelentkezés" left="25%" top="15%"/>
                <PageBtn buttonText="Regisztráció"  right="25%" top="15%"/>


                <InputPlus left="15%" width="70%" top="32.5%" height="5%"  type="text" placeholder="Email" imageSrc="Email"/>
                <InputPlus left="15%" width="70%" top="47.5%" height="5%" type="password" placeholder="Jelszó" imageSrc="Key"/>
                
                <button className='loginBtn rounded-pill'>Bejelentkezés</button>

            </div>

        </React.Fragment>);
    }
}
 
export default Panel;
