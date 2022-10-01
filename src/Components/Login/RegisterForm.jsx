import React, { Component } from 'react';

import InputPlus from "./InputPlus"


class RegisterForm extends Component {
    state = {  } 
    render() { 
        return (
            <React.Fragment>               
                <form>
                <InputPlus left="15%" width="70%" top="32.5%" height="5%"  type="email" placeholder="Vezetéknév" autocompleteID="email"/>
                </form>

            </React.Fragment>
        );
    }
}
 
export default RegisterForm;
