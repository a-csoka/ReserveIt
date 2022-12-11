import React, {useEffect} from 'react';
import { Outlet } from 'react-router';

import PageBtn from "./PageBtn"
import ReserveIt_Text from "./images/ReserveIt_OnlyText.png"

import "./css/Panel.css";





export default function Panel(){
    useEffect(() => {
        // Add reCaptcha
        const script = document.createElement("script")
        script.src = "https://www.google.com/recaptcha/api.js?render=6Lek6BMjAAAAAJJWkTr68AMv6jzYsLk1gi7UVFZm"
        document.body.appendChild(script)
    }, [])

    return (
        <div className='loginContainer'>
            <div className='formContainer'>
                <div className='background'></div>
                <div className="PageBtnContainer">
                     <PageBtn buttonText="Bejelentkezés" pos="lefter" redirect="/login" />
                     <PageBtn buttonText="Regisztráció" pos="righter" redirect="/register" />
                </div>
                <Outlet />
            </div>
            <div className='iconContainer'>
                <img draggable="false" src={ReserveIt_Text} alt="Hiba a betöltés során!"></img>
            </div>
        </div>    
    );
}

/*
                <div className='container'>
                    <div className="loginDiv">
                        <div className="background"></div>
                        <div className='ReserveIt_Icon'>
                            <img draggable="false" src={ReserveIt_Text} alt="Hiba a betöltés során!"></img>
                        </div>
                        <Outlet />
                        <div className='pageBtnContainer'>
                            <PageBtn buttonText="Bejelentkezés" pos="left" redirect="/login" />
                            <PageBtn buttonText="Regisztráció"  pos="right"redirect="/register" />
                        </div>
                    </div>
                </div>
                */