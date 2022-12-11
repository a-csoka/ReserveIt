import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom'

import "./css/ForgottenPasswordForm.css";

import InputPlus from "./InputPlus"



export default function ForgottenPasswordForm() {
    const {Key} = useParams()
    const [Display, setDisplay] = useState(
        <React.Fragment>
            <div className='noLink'>Nem felismerhető vagy lejárt a link!</div>
        </React.Fragment>
    )
    const [Password, setPassword] = useState("")
    const [RePassword, setRePassword] = useState("")
    const [Errors, setErrors] = useState({
        "Password": "",
        "RePassword": ""
    })

    function clearError(ID) {
        var tempErr = {...Errors}
        tempErr[ID] = ""
        setErrors(tempErr)
    }

    useEffect(() => {
        fetch("http://127.0.0.1:5000/checkNewPasswordKey", {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({EditKey: Key})
        }).then((response) => response.json()).then((data) => {
            if(data.State){
                setDisplay(        
                <React.Fragment>
                    <form onSubmit={(event) => {
                        event.preventDefault()
                        }}>
                        <div className='forgotExplain'>Add meg az új jelszavadat!</div>
                        <InputPlus left="15%" width="70%" top="45%" height="5%"  type="password" placeholder="Jelszó" imageSrc="Key" autocompleteID="new-password" dataSet={(txt) => {setPassword(txt); clearError("Password")}} ErrorMsg={Errors["Password"]}/>
                        <InputPlus left="15%" width="70%" top="60%" height="5%"  type="password" placeholder="Jelszó megerősítés" imageSrc="Key" autocompleteID="new-password" dataSet={(txt) => {setRePassword(txt); clearError("RePassword")}} ErrorMsg={Errors["RePassword"]}/>
                        <button type="submit" className='loginBtn rounded-pill' style={{
                            top: "80%"
                        }}>Megváltoztatás</button>
                    </form>
                </React.Fragment>
                )
            }
        })
    })
    

    return (
        Display
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
