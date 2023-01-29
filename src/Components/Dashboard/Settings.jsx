import React from 'react';

import "./css/Settings.css"
import { useState } from 'react';

function Settings() {
    const [oldPw, setOldPw] = useState("")
    const [newPw, setNewPw] = useState("")
    const [rePw, setRePw] = useState("")
    const [errors, setErrors] = useState({
        "OldPassword": "",
        "Password": "",
        "RePassword": ""
    })



    return ( 
        <div className='SettingsDiv'>
            <div className='BigTitle'>Jelszó változtatás</div>

            <div className='SmollTitle'>Jelenlegi jelszó</div>
            <input type="password" placeholder='Jelenlegi jelszó' onChange={(event) => {setOldPw(event.target.value);clearErrors()}}/>
            <div className='errorText' style={{
                color: (errors["OldPassword"] === "A jelszavad sikeresen megváltoztattuk!" ? "#228B22" : "#8b2722")
            }}>{errors["OldPassword"]}</div>

            <div className='SmollTitle'>Új jelszó</div>
            <input type="password" placeholder='Új jelszó' onChange={(event) => {setNewPw(event.target.value);clearErrors()}}/>
            <div className='errorText'>{errors["Password"]}</div>

            <div className='SmollTitle'>Új jelszó - Megerősítés</div>
            <input type="password" placeholder='Új jelszó - Megerősítés' onChange={(event) => {setRePw(event.target.value);clearErrors()}}/>
            <div className='errorText'>{errors["RePassword"]}</div>

            <button className='changeBtn' onClick={() => {
                changePwFunction()
            }}>Megváltoztatás</button>
        </div>
    );

    function clearErrors(){
        setErrors({
            "OldPassword": "",
            "Password": "",
            "RePassword": ""
        })
    }


    function changePwFunction(){
        var tempErr = {
            "OldPassword": "",
            "Password": "",
            "RePassword": ""
        }
        if(isFieldEmpty(oldPw)){
            tempErr["OldPassword"] = "Üres mező!"
        }

        if(isFieldEmpty(newPw)){
            tempErr["Password"] = "Üres mező!"
        }

        if(isFieldEmpty(rePw)){
            tempErr["RePassword"] = "Üres mező!"
        }


        if(isThereError(tempErr)){
            setErrors(tempErr)
            return false
        }

        if(newPw !== rePw){
            tempErr["Password"] = "A két jelszó nem egyezik meg!"
            tempErr["RePassword"] = "A két jelszó nem egyezik meg!"
            setErrors(tempErr)
            return false
        }

        if(!new RegExp(".{8}").test(newPw)){
            tempErr["Password"] = "A jelszavadnak legalább 8 karakterből kell állnia!"
            tempErr["RePassword"] = "A jelszavadnak legalább 8 karakterből kell állnia!"
            setErrors(tempErr)
            return false
        }
        if(!new RegExp("(?=.*[A-Z])").test(newPw)){
            tempErr["Password"] = "A jelszavadnak tartalmaznia kell legalább 1 nagy betűt!"
            tempErr["RePassword"] = "A jelszavadnak tartalmaznia kell legalább 1 nagy betűt!"
            setErrors(tempErr)
            return false
        }
        if(!new RegExp("(?=.*[0-9])").test(newPw)){
            tempErr["Password"] = "A jelszavadnak tartalmaznia kell legalább 1 számot!"
            tempErr["RePassword"] = "A jelszavadnak tartalmaznia kell legalább 1 számot!"
            setErrors(tempErr)
            return false
        }

     
        fetch('http://127.0.0.1:5000/changePassword', {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({OldPassword: oldPw, password: newPw, RePassword: rePw})
        }).then((response) => response.json()).then((data) => {
            setErrors(data.Errors)
        })
}
}
export default Settings;

function isThereError(list){
    for (const data of Object.entries(list)) {
        if(data[1] !== ""){
            return true
        }
    }
    return false
}

function isFieldEmpty(text){
    if(typeof(text) !== "undefined"){
        if(text.replace(" ", "") !== ""){
            return false
        }
    }
    return true
}
