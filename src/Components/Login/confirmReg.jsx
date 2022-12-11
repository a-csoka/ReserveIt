import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom'

import "./css/ForgottenPasswordForm.css";

export default function confirmReg(){
    const {Key} = useParams()
    const [Display, setDisplay] = useState("Hiba a szerverre való kapcsolódás során!")

    useEffect(() => {
        if(Display === "Hiba a szerverre való kapcsolódás során!")
            fetch("http://127.0.0.1:5000/verifyAccount", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({EditKey: Key})
            }).then((response) => response.json()).then((data) => {
                console.log(data.State)
                setDisplay(data.State)
            })
    })


    return(<div className='noLink'>{Display}</div>)

}
