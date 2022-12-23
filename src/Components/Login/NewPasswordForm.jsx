import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom'

import "./css/ForgottenPasswordForm.css";

import InputPlus from "./InputPlus"



export default function ForgottenPasswordForm() {
    const {Key} = useParams()
    const navigate = useNavigate();
    const [Display, setDisplay] = useState("NoCon")
    const [Password, setPassword] = useState("")
    const [RePassword, setRePassword] = useState("")
    const [Errors, setErrors] = useState({
        "Password": "",
        "RePassword": ""
    })

    function getPage(){
        return(
            <React.Fragment>
            <form onSubmit={(event) => {
                    event.preventDefault()
                    FieldCheck({
                        password: Password,
                        RePassword: RePassword
                    })
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
        var tempErr = {
            "Password": "",
            "RePassword": ""
        }
        if(isFieldEmpty(dict.password)){
            tempErr["Password"] = "Üres mező!"
            setErrors(tempErr)
        }

        if(isFieldEmpty(dict.RePassword)){
            tempErr["RePassword"] = "Üres mező!"
            setErrors(tempErr)
        }


        if(isThereError(tempErr)){ //Ha volt hiba, akkor beállítja a hibákat és nem engedi tovább
            setErrors(tempErr)
            return false
        }

        if(dict.password !== dict.RePassword){
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


        window.grecaptcha.ready(_ => {
            window.grecaptcha
              .execute("6Lek6BMjAAAAAJJWkTr68AMv6jzYsLk1gi7UVFZm", { action: "changePassword" })
              .then(token => {
                fetch("http://127.0.0.1:5000/recaptcha", {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({token: token})
                }).then((response) => response.json()).then((data) => {
                    if(data.response){
                        dict["EditKey"] = Key        
                        fetch('http://127.0.0.1:5000/changePassword', {
                            method: "POST",
                            headers: {
                                'Content-type': 'application/json'
                            },
                            body: JSON.stringify(dict)
                        }).then((response) => response.json()).then((data) => {
                            setErrors({...data.Errors})
                            //Írj ide IF-et, mert mindig átdobja.
                            setTimeout(function() {
                                navigate("/login");
                              }, 3000);
                            })
                    }
                })
              })
        })
    }

    useEffect(() => {
        if (Display === "NoCon"){
            fetch("http://127.0.0.1:5000/checkNewPasswordKey", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({EditKey: Key})
            }).then((response) => response.json()).then((data) => {
                if(data.State === true){
                    setDisplay("Page")
                }else{
                    setDisplay(data.State)
                }
            })
        }
    })

    switch(Display){
        case "NoCon": return (<div className='noLink'>Hiba a szerverre való kapcsolódás során!</div>)
        case "Page": return getPage()
        default: return <div className='noLink'>{Display}</div>
    }

}

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
