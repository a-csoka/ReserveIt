import React, {useState} from 'react';

import "./css/ForgottenPasswordForm.css";

import InputPlus from "./InputPlus"


export default function ForgottenPasswordForm() {
    const [Password, setPassword] = useState("")
    const [RePassword, setRePassword] = useState("")
    const [Errors, setErrors] = useState({
        "Password": "",
        "RePassword": ""
    })
    var page = 

    function clearError(ID) {
        var tempErr = {...Errors}
        tempErr[ID] = ""
        setErrors(tempErr)
    }

    

    return (

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
