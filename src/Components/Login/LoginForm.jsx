import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import "./css/LoginForm.css";
import Cookies from 'js-cookie';
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
        var tempErr = {
            "Email": "",
            "Password": "",
        }
        if(isFieldEmpty(dict.email)){
            tempErr["Email"] = "Üres mező!"
        }
        if(isFieldEmpty(dict.password)){
            tempErr["Password"] = "Üres mező!"
        }

        if(isThereError(tempErr)){ //Ha volt hiba, akkor beállítja a hibákat és nem engedi tovább
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
                        fetch('http://127.0.0.1:5000/loginUser', {
                            method: "POST",
                            credentials: 'include',                           
                            headers: {
                                'Content-type': 'application/json',
                            },
                            body: JSON.stringify(dict)
                        }).then((response) => response.json()).then((data) => {
                            if(Cookies.get('userToken') != null){
                                navigate("../dashboard/mycalendar/calendar")
                            }else{
                                setErrors({...data})
                            }                           
                        })
                    }
                })
              })
        })


        return true
    }

    function clearError(ID) {
        var tempErr = {...Errors}
        tempErr[ID] = ""
        setErrors(tempErr)
    }

    return (
        <React.Fragment>
            <div className='forgotWrapper'>
                <div className='forgotBtn'  onClick={() => {
                navigate("/loginPage/forgottenPassword")
            }}>Elfelejtette a jelszavát?</div>
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

function isThereError(list){
    for (const data of Object.entries(list)) {
        if(data[1] !== ""){
            return true
        }
    }
    return false
}