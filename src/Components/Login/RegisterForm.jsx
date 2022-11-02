import React, { Component } from 'react';
import { useState } from 'react';

import "./css/RegisterForm.css";

import InputPlus from "./InputPlus"


export default function RegisterForm(){
    const [FirstName, setFirstName] = useState("")
    const [LastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rePassword, setRePassword] = useState("")

    return (
        <React.Fragment>               
            <form>
                <InputPlus left="15%" width="32.5%" top="25.5%" height="5%"  type="text" placeholder="Vezetéknév" autocompleteID="family-name"/>
                <InputPlus left="52.5%" width="32.5%" top="25.5%" height="5%"  type="text" placeholder="Keresztnév" autocompleteID="given-name"/>

                <InputPlus left="15%" width="70%" top="40.5%" height="5%"  type="email" placeholder="Email" imageSrc="Email" autocompleteID="email"/>

                <InputPlus left="15%" width="70%" top="55.5%" height="5%" type="password" placeholder="Jelszó" imageSrc="Key" autocompleteID="new-password"/>  
                <InputPlus left="15%" width="70%" top="70.5%" height="5%" type="password" placeholder="Jelszó megerősítés" imageSrc="Key" autocompleteID="new-password"/>

                <button type="button" className='registerBtn rounded-pill'>Regisztráció</button> 
            </form>

        </React.Fragment>
    );
}
