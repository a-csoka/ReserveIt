import React, { Component } from 'react';

import PageBtn from "./PageBtn"

class RegisterForm extends Component {
    state = {  } 
    render() { 
        return (
            <React.Fragment>
                <PageBtn buttonText="Bejelentkezés" left="25%" top="15%" redirect="/" />
                <PageBtn buttonText="Regisztráció"  right="25%" top="15%" redirect="/register" active={true}/>
                <h1>REGISZTRÁCIÓ</h1>

            </React.Fragment>
        );
    }
}
 
export default RegisterForm;
