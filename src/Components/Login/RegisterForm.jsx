import React from 'react';
import { useState } from 'react';

import "./css/RegisterForm.css";

import InputPlus from "./InputPlus"

function sendRegisterToBackend(dict){
    fetch('http://localhost:5000/registerUser', {
    method: "POST",
    headers: {
        'Content-type': 'application/json'
    },
    body: JSON.stringify(dict)
    })
}


export default function RegisterForm(){
    const [FirstName, setFirstName] = useState("")
    const [LastName, setLastName] = useState("")
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [RePassword, setRePassword] = useState("")

    return (
        <React.Fragment>               
            <form>
                <InputPlus left="15%" width="32.5%" top="25.5%" height="5%"  type="text" placeholder="Vezetéknév" autocompleteID="family-name" dataSet={setLastName} />
                <InputPlus left="52.5%" width="32.5%" top="25.5%" height="5%"  type="text" placeholder="Keresztnév" autocompleteID="given-name" dataSet={setFirstName} />

                <InputPlus left="15%" width="70%" top="40.5%" height="5%"  type="email" placeholder="Email" imageSrc="Email" autocompleteID="email" dataSet={setEmail} />

                <InputPlus left="15%" width="70%" top="55.5%" height="5%" type="password" placeholder="Jelszó" imageSrc="Key" autocompleteID="new-password" dataSet={setPassword} />  
                <InputPlus left="15%" width="70%" top="70.5%" height="5%" type="password" placeholder="Jelszó megerősítés" imageSrc="Key" autocompleteID="new-password" dataSet={setRePassword} />

                <button type="button" className='registerBtn rounded-pill' onClick={() => {
                    sendRegisterToBackend({
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
