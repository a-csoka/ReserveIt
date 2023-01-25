import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import "./css/Create.css"

const emailValidator = require("email-validator");

function MyBusinessesCreate() {
    const navigate = useNavigate()
    const [errorList, setErrorList] = useState({
        OrgName: "",
        OrgLocation: "",
        OrgMail: "",
        OrgPhone: "",

        OwnerName: "",
        OwnerMail: "",
        OwnerPhone: "",
    })

    const [OrgName, setOrgName] = useState("")
    const [OrgLocation, setOrgLocation] = useState("")
    const [OrgEmail, setOrgEmail] = useState("")
    const [OrgPhone, setOrgPhone] = useState("")

    const [OwnerName, setOwnerName] = useState("")
    const [OwnerMail, setOwnerMail] = useState("")
    const [OwnerPhone, setOwnerPhone] = useState("")

    function createOrgFunction(){
        var tempError = {
            OrgName: "",
            OrgLocation: "",
            OrgMail: "",
            OrgPhone: "",
    
            OwnerName: "",
            OwnerMail: "",
            OwnerPhone: "",
        }

        if(isFieldEmpty(OrgName)){
            tempError.OrgName = "Üres mező!"
        }
        if(isFieldEmpty(OrgLocation)){
            tempError.OrgLocation = "Üres mező!"
        }
        if(isFieldEmpty(OrgEmail)){
            tempError.OrgMail = "Üres mező!"
        }
        if(isFieldEmpty(OwnerName)){
            tempError.OwnerName = "Üres mező!"
        }
        if(isFieldEmpty(OwnerMail)){
            tempError.OwnerMail = "Üres mező!"
        }
        if(isFieldEmpty(OwnerPhone)){
            tempError.OwnerPhone = "Üres mező!"
        }

        if(isThereError(tempError)){
            setErrorList(tempError)
            return false
        }

        if(!emailValidator.validate(OrgEmail)){
            return false
        }
        if(!emailValidator.validate(OwnerMail)){
            return false
        }

        fetch("http://127.0.0.1:5000/createOrganization",{
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                OrgName: OrgName,
                OrgLocation: OrgLocation,
                OrgPhone: OrgPhone,
                OrgEmail: OrgEmail,

                OwnerName: OwnerName,
                OwnerMail: OwnerMail,
                OwnerPhone: OwnerPhone
            })
        }).then((response) => response.json()).then(data => {
            console.log(data.errors)
            if(data.errors != null){
                setErrorList(data.errors)
                return false
            }
            if(data.redirect != null){
                navigate("./list")
                return true
            }
        })
    }
    

    return ( 
    <React.Fragment>
        <div className='BigTitle'>Cég</div>
        <div className='SmollTitle'>Vállalkozás neve</div>
        <input placeholder='Vállalkozás neve' name="organization" onChange={(event) => {setOrgName(event.target.value)}}/>
        <div className='errorMsg2'>{errorList.OrgName}</div>

        <div className='SmollTitle'>Bejegyzett cím</div>
        <input placeholder='Bejegyzett cím' onChange={(event) => {setOrgLocation(event.target.value)}}/>
        <div className='errorMsg2'>{errorList.OrgLocation}</div>

        <div className='SmollTitle'>Elérhetőség - Email</div>
        <input placeholder='Elérhetőség - Email' type="email" onChange={(event) => {setOrgEmail(event.target.value)}}/>
        <div className='errorMsg2'>{errorList.OrgMail}</div>

        <div className='SmollTitle'>Elérhetőség - Telefonszám (nem kötelező)</div>
        <input placeholder='Elérhetőség - Telefonszám (nem kötelező)' type="tel" name="phone" onChange={(event) => {setOrgPhone(event.target.value)}}/>
        <div className='errorMsg2'>{errorList.Phone}</div>

        <div className='BigTitle'>Tulajdonos</div>

        <div className='SmollTitle'>Neve</div>
        <input placeholder='Neve' onChange={(event) => {setOwnerName(event.target.value)}}/>
        <div className='errorMsg2'>{errorList.OwnerName}</div>

        <div className='SmollTitle'>Email</div>
        <input placeholder='Email' type="email" name="email" onChange={(event) => {setOwnerMail(event.target.value)}}/>
        <div className='errorMsg2'>{errorList.OwnerMail}</div>

        <div className='SmollTitle'>Telefonszám</div>
        <input placeholder='Telefonszám' type="tel" name="phone" onChange={(event) => {setOwnerPhone(event.target.value)}}/>
        <div className='errorMsg2'>{errorList.OwnerPhone}</div>

        <button className='createBtn' onClick={() => createOrgFunction()}>Létrehozás</button>
        <div className='space'></div>
    </React.Fragment> 
    );
}
export default MyBusinessesCreate;

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

/*
<div className='SmollTitle'>Cégjegyzékszám</div>
<input placeholder='Cégjegyzékszám'/>

<div className='SmollTitle'>Adószám</div>
<input placeholder='Adószám'/>


    Vállakozás neve
    Telefonszám
    Email cím
    Tulajdonos neve

    Elérhetőség
    Bejegyzett cím
    Cégjegyzékszám

*/
