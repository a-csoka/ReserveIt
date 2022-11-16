import React, {useState} from 'react';

import "./css/LoginForm.css";

import InputPlus from "./InputPlus"


export default function LoginForm(){
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [Errors, setErrors] = useState({
        "Email": "",
        "Password": "",
    })

    function clearError(ID) {
        var tempErr = {...Errors}
        tempErr[ID] = ""
        if(ID === "Password" || ID === "RePassword"){
            tempErr["Password"] = ""
            tempErr["RePassword"] = ""
        }
        setErrors(tempErr)
    }

    return (
        <React.Fragment>
            <div className='forgotWrapper'>
                <div className='forgotBtn'>Elfelejtette a jelszavát?</div>
            </div>
            <form autoComplete='on'>
                <InputPlus left="15%" width="70%" top="32.5%" height="5%"  type="email" placeholder="Email" imageSrc="Email" autocompleteID="email" dataSet={(txt) => {setEmail(txt); clearError("Email")}} ErrorMsg={Errors["Email"]}/>
                <InputPlus left="15%" width="70%" top="47.5%" height="5%" type="password" placeholder="Jelszó" imageSrc="Key" autocompleteID="current-password" dataSet={(txt) => {setPassword(txt); clearError("Password");}} ErrorMsg={Errors["Password"]}/>                   

                <button type="submit" className='loginBtn rounded-pill'>Bejelentkezés</button>
            </form>
        </React.Fragment>
    );
}
