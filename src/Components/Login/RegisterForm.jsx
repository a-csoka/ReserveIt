import React, {useState} from 'react';

import "./css/RegisterForm.css";

import InputPlus from "./InputPlus"

const emailValidator = require("email-validator");

export default function RegisterForm(){
    const [FirstName, setFirstName] = useState("")
    const [LastName, setLastName] = useState("")
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [RePassword, setRePassword] = useState("")

    const [Errors, setErrors] = useState({
        "FirstName": "",
        "LastName": "",
        "Email": "",
        "Password": "",
        "RePassword": "",
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

    function FieldCheck(dict){
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

        if(!deepEqual({...tempErr}, {...Errors})){ //Ha volt hiba, akkor beállítja a hibákat és nem engedi tovább
            setErrors(tempErr)
            return false
        }

        if(dict.password !== dict.rePassword){
            tempErr["Password"] = "A két jelszó nem egyezik meg!"
            tempErr["RePassword"] = "A két jelszó nem egyezik meg!"
            setErrors(tempErr)
            return false
        }

        if(!new RegExp(".{8}").test(dict.password)){
            tempErr["Password"] = "A jelszavadnak legalább 8 karakterből kell állnia!"
            tempErr["RePassword"] = "A jelszavadnak legalább 8 karakterből kell állnia!"
            setErrors(tempErr)
            return false
        }
        if(!new RegExp("(?=.*[A-Z])").test(dict.password)){
            tempErr["Password"] = "A jelszavadnak tartalmaznia kell legalább 1 nagy betűt!"
            tempErr["RePassword"] = "A jelszavadnak tartalmaznia kell legalább 1 nagy betűt!"
            setErrors(tempErr)
            return false
        }
        if(!new RegExp("(?=.*[0-9])").test(dict.password)){
            tempErr["Password"] = "A jelszavadnak tartalmaznia kell legalább 1 számot!"
            tempErr["RePassword"] = "A jelszavadnak tartalmaznia kell legalább 1 számot!"
            setErrors(tempErr)
            return false
        }

        if(!emailValidator.validate(dict.email)){
            tempErr["Email"] = "Ez az email cím nem megfelelő!"
            setErrors(tempErr)
            return false
        }

        fetch('http://localhost:5000/registerUser', {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(dict)
        }).then((response) => response.json()).then((data) => setErrors({...data}))
        return true
    }


    return (
        <React.Fragment>               
            <form autocomplete="on" onSubmit={(event) => {
                    event.preventDefault()
                    FieldCheck({
                        firstName: FirstName,
                        lastName: LastName,
                        email: Email,
                        password: Password,
                        rePassword: RePassword
                })}}>
                <InputPlus left="15%" width="32.5%" top="25.5%" height="5%"  type="text" placeholder="Vezetéknév" autocompleteID="family-name" dataSet={(txt) => {setFirstName(txt); clearError("FirstName")}} ErrorMsg={Errors["FirstName"]}/>
                <InputPlus left="52.5%" width="32.5%" top="25.5%" height="5%"  type="text" placeholder="Keresztnév" autocompleteID="given-name" dataSet={(txt) => {setLastName(txt); clearError("LastName")}} ErrorMsg={Errors["LastName"]}/>

                <InputPlus left="15%" width="70%" top="40.5%" height="5%"  type="email" placeholder="Email" imageSrc="Email" autocompleteID="email" dataSet={(txt) => {setEmail(txt); clearError("Email")}} ErrorMsg={Errors["Email"]}/>

                <InputPlus left="15%" width="70%" top="55.5%" height="5%" type="password" placeholder="Jelszó" imageSrc="Key" autocompleteID="new-password" dataSet={(txt) => {setPassword(txt); clearError("Password");}} ErrorMsg={Errors["Password"]}/>  
                <InputPlus left="15%" width="70%" top="70.5%" height="5%" type="password" placeholder="Jelszó megerősítés" imageSrc="Key" autocompleteID="new-password" dataSet={(txt) => {setRePassword(txt); clearError("RePassword");}} ErrorMsg={Errors["RePassword"]}/>

                <button type="submit" className='registerBtn rounded-pill'>Regisztráció</button> 
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