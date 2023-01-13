import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import {Navigate} from "react-router-dom";

function Redirect(props) {
    const [redirectLink, setRedirect] = useState()

    useEffect(() => {
        fetch("http://127.0.0.1:5000/verifyToken", {
            method: "GET",
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
            },
        }).then((response) => response.json()).then((data) => {
            setRedirect()
            var link = document.location.href.split('/');
            if(data.tokenState === true){
                if(link[3] !== "dashboard"){
                    setRedirect("/dashboard")
                }  
            }else{
                if(link[3] !== "loginPage"){  
                    if(!props.onlyCheckLoggedIn === true){
                        setRedirect("/loginPage/login")
                    }
                }
            }
        })
    })

    if(redirectLink !== undefined){
        return ( <Navigate to={redirectLink}/> );
    }

}

export default Redirect;
