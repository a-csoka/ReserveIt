import React from 'react';
import { useState, useRef} from 'react';

import "./css/RegisterForm.css";

import InputPlus from "./InputPlus"


export default function RegisterForm(){
    const [FirstName, setFirstName] = useState("")
    const [LastName, setLastName] = useState("")
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [RePassword, setRePassword] = useState("")

    const [Errors, setErrors] = useState({
        FirstName: "",
        LastName: "",
        Email: "",
        Password: "",
        RePassword: "",
    })

    function clearError(ID) {
        var tempErr = {...Errors}
        tempErr[ID] = ""
        setErrors(tempErr)
    }

    function fieldCheck(dict){
        var tempErr = {...Errors}
        if(isFieldEmpty(dict.firstName)){
            tempErr["FirstName"] = "Üres mező!"
        }
        if(isFieldEmpty(dict.lastName)){
            tempErr["LastName"] = "Üres mező!"
        }
        if(isFieldEmpty(dict.email)){
            tempErr["Email"] = "Üres mező!"
        }
        if(isFieldEmpty(dict.password)){
            tempErr["Password"] = "Üres mező!"
        }
        if(isFieldEmpty(dict.rePassword)){
            tempErr["RePassword"] = "Üres mező!"
        }
        setErrors(tempErr)
    }


    return (
        <React.Fragment>               
            <form>
                <InputPlus left="15%" width="32.5%" top="25.5%" height="5%"  type="text" placeholder="Vezetéknév" autocompleteID="family-name" dataSet={() => {setLastName(); clearError("FirstName")}} ErrorMsg={Errors["FirstName"]}/>
                <InputPlus left="52.5%" width="32.5%" top="25.5%" height="5%"  type="text" placeholder="Keresztnév" autocompleteID="given-name" dataSet={() => {setFirstName(); clearError("LastName")}} ErrorMsg={Errors["LastName"]}/>

                <InputPlus left="15%" width="70%" top="40.5%" height="5%"  type="email" placeholder="Email" imageSrc="Email" autocompleteID="email" dataSet={() => {setEmail(); clearError("Email")}} ErrorMsg={Errors["Email"]}/>

                <InputPlus left="15%" width="70%" top="55.5%" height="5%" type="password" placeholder="Jelszó" imageSrc="Key" autocompleteID="new-password" dataSet={() => {setPassword(); clearError("Password")}} ErrorMsg={Errors["Password"]}/>  
                <InputPlus left="15%" width="70%" top="70.5%" height="5%" type="password" placeholder="Jelszó megerősítés" imageSrc="Key" autocompleteID="new-password" dataSet={() => {setRePassword(); clearError("RePassword")}} ErrorMsg={Errors["RePassword"]}/>

                <button type="button" className='registerBtn rounded-pill' onClick={() => {
                    fieldCheck({
                        lastName: LastName,
                        firstName: FirstName,
                        email: Email,
                        password: Password,
                        rePassword: RePassword
                    })
                }}>Regisztráció</button> 
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

function sendRegisterToBackend(dict){

    fetch('http://localhost:5000/registerUser', {
    method: "POST",
    headers: {
        'Content-type': 'application/json'
    },
    body: JSON.stringify(dict)
    })
}