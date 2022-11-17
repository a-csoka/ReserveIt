import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import "./css/LoginForm.css";

import InputPlus from "./InputPlus"

const emailValidator = require("email-validator");

export default function LoginForm(){
    const navigate = useNavigate()
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [Errors, setErrors] = useState({
        "Email": "",
        "Password": "",
    })

    function FieldCheck(dict){
        var tempErr = {...Errors}
        if(isFieldEmpty(dict.email)){
            tempErr["Email"] = "Üres mező!"
        }
        if(isFieldEmpty(dict.password)){
            tempErr["Password"] = "Üres mező!"
        }

        if(!deepEqual({...tempErr}, {...Errors})){ //Ha volt hiba, akkor beállítja a hibákat és nem engedi tovább
            setErrors(tempErr)
            return false
        }

        if(!emailValidator.validate(dict.email)){
            tempErr["Email"] = "Ez az email cím nem megfelelő!"
            setErrors(tempErr)
            return false
        }

        fetch('http://localhost:5000/loginUser', {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(dict)
        }).then((response) => response.json()).then((data) => setErrors({...data}))
        return true
    }

    function clearError(ID) {
        var tempErr = {...Errors}
        tempErr[ID] = ""
        setErrors(tempErr)
    }

    return (
        <React.Fragment>
            <div className='forgotWrapper' onClick={() => {
                navigate("/forgottenPassword")
            }}>
                <div className='forgotBtn'>Elfelejtette a jelszavát?</div>
            </div>
            <form autoComplete='on' onSubmit={(event) => {
                    event.preventDefault()
                    FieldCheck({
                        email: Email,
                        password: Password,
                })}}>
                <InputPlus left="15%" width="70%" top="32.5%" height="5%"  type="email" placeholder="Email" imageSrc="Email" autocompleteID="email" dataSet={(txt) => {setEmail(txt); clearError("Email")}} ErrorMsg={Errors["Email"]}/>
                <InputPlus left="15%" width="70%" top="47.5%" height="5%" type="password" placeholder="Jelszó" imageSrc="Key" autocompleteID="current-password" dataSet={(txt) => {setPassword(txt); clearError("Password");}} ErrorMsg={Errors["Password"]}/>                   

                <button type="submit" className='loginBtn rounded-pill'>Bejelentkezés</button>
            </form>
        </React.Fragment>
    );
}

function isFieldEmpty(text){
    if(typeof(text) !== "undefined"){
        if(text.replace(" ", "") !== ""){
            return false
        }
    }
    return true
}

function deepEqual(x, y) {
    const ok = Object.keys, tx = typeof x, ty = typeof y;
    return x && y && tx === 'object' && tx === ty ? (
      ok(x).length === ok(y).length &&
        ok(x).every(key => deepEqual(x[key], y[key]))
    ) : (x === y);
}