import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import {Navigate} from "react-router-dom";

var toRedirect

function Redirect(props) {
    const [redirectLink, setRedirect] = useState(false)

    useEffect(() => {
        fetch("http://127.0.0.1:5000/verifyToken", {
            method: "GET",
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
            },
        }).then((response) => response.json()).then((data) => {
            setRedirect(false)
            var link = document.location.href.split('/');
            if(data.tokenState === true){
                if((link[3] !== "dashboard" && link[3] !== "BusinessManage") || props.onlyCheckWrongLink){
                    setRedirect(true)
                    toRedirect = "/dashboard/mycalendar"
                }  
            }else{
                if(link[3] !== "loginPage"){  
                    if(!props.onlyCheckLoggedIn === true){
                        setRedirect(true)
                        toRedirect = "/loginPage/login"
                    }
                }
            }
        })
    })

    if(redirectLink){
        return ( <Navigate to={toRedirect}/> );
    }

}

export default Redirect;
