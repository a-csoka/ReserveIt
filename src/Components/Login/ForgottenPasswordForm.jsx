import React, {useState} from 'react';

import "./css/ForgottenPasswordForm.css";

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

    function FieldCheck(dict){
        var tempErr = {
            "Email": "",
        }
        if(isFieldEmpty(dict.email)){
            tempErr["Email"] = "Üres mező!"
            setErrors(tempErr)
            return false
        }

        if(!emailValidator.validate(dict.email)){
            tempErr["Email"] = "Ez az email cím nem megfelelő!"
            setErrors(tempErr)
            return false
        }

        window.grecaptcha.ready(_ => {
            window.grecaptcha
              .execute("6Lek6BMjAAAAAJJWkTr68AMv6jzYsLk1gi7UVFZm", { action: "login" })
              .then(token => {
                fetch("http://127.0.0.1:5000/recaptcha", {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({token: token})
                }).then((response) => response.json()).then((data) => {
                    if(data.response){            
                        fetch('http://127.0.0.1:5000/forgottenpassword', {
                            method: "POST",
                            headers: {
                                'Content-type': 'application/json'
                            },
                            body: JSON.stringify(dict)
                        }).then((response) => response.json()).then((data) => setErrors({...data}))
                    }
                })
              })
        })
    }

    return (  
        <React.Fragment>
            <form onSubmit={(event) => {
                event.preventDefault()
                FieldCheck({
                    email: Email,
                })
                }}>
                <div className='forgotExplain'>Írd be a felhasználódhoz tartozó email címet. Amennyiben megtalálható a rendszerünkben, akkor elküldjük rá a jelszavad megváltoztatásához szükséges linket.</div>
                <InputPlus left="15%" width="70%" top="60%" height="5%"  type="email" placeholder="Email" imageSrc="Email" autocompleteID="email" dataSet={(txt) => {setEmail(txt); clearError("Email")}} ErrorMsg={Errors["Email"]}/>
                <button type="submit" className='loginBtn rounded-pill' style={{
                    top: "80%"
                }}>Küldés</button>
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
