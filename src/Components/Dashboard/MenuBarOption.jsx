import React from 'react'
import { useNavigate } from "react-router-dom";
import "./css/MenuBarOption.css"

import Exit from "./images/right-from-bracket-solid.svg"
import User from "./images/user-solid.svg"
import Calendar from "./images/calendar-days-regular.svg"
import Building from "./images/building-solid.svg"
import Store from "./images/store-solid.svg"
import Gear from "./images/gear-solid.svg"

const imageImports = {
    "Exit": Exit,
    "User": User,
    "Calendar": Calendar,
    "Building": Building,
    "Store": Store,
    "Gear": Gear,
}


function MenuBarOption(props) {
    const navigate = useNavigate();
    return ( 
    <div className='OneOptionContainer' onClick={() => {
        navigate(props.To)
    }}>
        <img className="icon" src={imageImports[props.Icon]} alt="Hiba a betöltés során!" />
        <img className="iconEffect" src={imageImports[props.Icon]} alt="Hiba a betöltés során!" />
        <div className='text'>{props.Text}</div>
    </div> );
}

export default MenuBarOption;