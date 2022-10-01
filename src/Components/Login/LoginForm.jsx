import React, { Component } from 'react';

import "./css/LoginForm.css";

import InputPlus from "./InputPlus"
import PageBtn from "./PageBtn"

class LoginForm extends Component {
    render() { 
        return (
            <React.Fragment>
                <div className='forgotWrapper'>
                    <div className='forgotBtn'>Elfelejtette a jelszavát?</div>
                </div>
                <form autoComplete='on'>
                    <InputPlus left="15%" width="70%" top="32.5%" height="5%"  type="email" placeholder="Email" imageSrc="Email" autocompleteID="email"/>
                    <InputPlus left="15%" width="70%" top="47.5%" height="5%" type="password" placeholder="Jelszó" imageSrc="Key" autocompleteID="current-password"/>                   

                    <button type="submit" className='loginBtn rounded-pill'>Bejelentkezés</button>
                </form>
                <PageBtn buttonText="Bejelentkezés" left="25%" top="15%" redirect="/" active={true}/>
                <PageBtn buttonText="Regisztráció"  right="25%" top="15%" redirect="/register"/>
            </React.Fragment>
        );
    }
}
 
export default LoginForm;
