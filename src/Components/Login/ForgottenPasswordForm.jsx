import React, {useState} from 'react';

//import "./css/LoginForm.css";

import InputPlus from "./InputPlus"

const emailValidator = require("email-validator");

export default function ForgottenPasswordForm() {
    const [Email, setEmail] = useState("")
    const [Errors, setErrors] = useState({
        "Email": "",
    })

    function clearError(ID) {
        var tempErr = {...Errors}
        tempErr[ID] = ""
        setErrors(tempErr)
    }

    return (  
        <React.Fragment>
            <InputPlus left="15%" width="70%" top="32.5%" height="5%"  type="email" placeholder="Email" imageSrc="Email" autocompleteID="email" dataSet={(txt) => {setEmail(txt); clearError("Email")}} ErrorMsg={Errors["Email"]}/>
        </React.Fragment>    
    );
}

