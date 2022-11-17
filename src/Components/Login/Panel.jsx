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
        <React.Fragment>           
            <div id="loginDiv">
                <div className="background"></div>
                <div className='ReserveIt_Icon'>
                    <img src={ReserveIt_Text} alt="Hiba a betöltés során!"></img>
                </div>
                <Outlet />
                <PageBtn buttonText="Bejelentkezés" left="25%" top="15%" redirect="/login" />
                <PageBtn buttonText="Regisztráció"  right="25%" top="15%" redirect="/register" />
            </div>
        </React.Fragment>);
}
