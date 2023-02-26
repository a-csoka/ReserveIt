import React, { useState, useEffect} from 'react';
import { useNavigate, useParams} from "react-router-dom";

import "./css/Settings.css"

function Settings() {
    const {BusinessID} = useParams()
    const navigate = useNavigate()

    const [showSettings, setShowSettings] = useState(false)

    const [oldPw, setOldPw] = useState("")
    const [newOrgName, setNewOrgName] = useState("")
    const [errors, setErrors] = useState({
        "OldPassword": "",
        "OrgName": "",
    })

    useEffect(() => {
        fetch("http://127.0.0.1:5000/isOrganizationAuthorized",{
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({BusinessID: BusinessID})
        }).then((response) => response.json()).then(data => {
            if(data.isOwner === 1){
                setShowSettings(true)
            }
        })
    }, [setShowSettings])

    if(showSettings){
        return ( 
            <div className='SettingsDiv'>
            <div className='BigTitle'>Beállítások</div>
    
            <div className='SmollTitle'>Jelszavad</div>
            <input type="password" placeholder='Jelszavad' onChange={(event) => {setOldPw(event.target.value);clearErrors()}}/>
            <div className='errorText' style={{
                color: "#8b2722"
            }}>{errors["OldPassword"]}</div>
    
            <div className='BigTitle'>Vállalkozás nevének megváltoztatása</div>
            <div className='SmollTitle'>Új név</div>
            <input type="text" placeholder='Új név' onChange={(event) => {setNewOrgName(event.target.value);clearErrors()}}/>
            <div className='errorText' style={{
                color: (errors["OrgName"] === "A vállalkozásod nevét sikeresen megváltoztattuk!" ? "#228B22" : "#8b2722")
            }}>{errors["OrgName"]}</div>
    
            <button className='changeBtn' onClick={() => {
                var tempErr = {
                    "OldPassword": "",
                    "OrgName": "",
                }
                if(isFieldEmpty(oldPw)){
                    tempErr["OldPassword"] = "Üres mező!"
                }
                if(isFieldEmpty(newOrgName)){
                    tempErr["OrgName"] = "Üres mező!"
                }
                if(isThereError(tempErr)){
                    setErrors(tempErr)
                    return false
                }
                fetch('http://127.0.0.1:5000/updateOrganizationName', {
                    method: "POST",
                    credentials: 'include',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({Password: oldPw, newName: newOrgName, BusinessID: BusinessID})
                }).then((response) => response.json()).then((data) => {
                    setErrors(data.Errors)
                })
            }}>Megváltoztatás</button>
    
    
            <div className='BigTitle'>Vállalkozás törlése</div>
            <button className='logoutBtn' onClick={() => {    
                var tempErr = {
                    "OldPassword": "",
                    "OrgName": "",
                }
                if(isFieldEmpty(oldPw)){
                    tempErr["OldPassword"] = "Üres mező!"
                    setErrors(tempErr)
                    return false
                }
                fetch('http://127.0.0.1:5000/deleteOrganization', {
                    method: "DELETE",
                    credentials: 'include',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({Password: oldPw, BusinessID: BusinessID})
                }).then((response) => response.json()).then((data) => {
                    if(data.Redirect){
                        navigate("../../dashboard/mybusinesses/list")
                    }else{
                        setErrors(data.Errors)
                    }
                })
            }}>Törlés</button>
            </div>)
    }else{
        return(<div className='noAccess'>Csak a vállalkozás tulajdonosa fér hozzá a beállításokhoz!</div>)
    }
    function clearErrors(){
        setErrors({
            "OldPassword": "",
            "Password": "",
            "RePassword": ""
        })
    }
}
export default Settings;

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