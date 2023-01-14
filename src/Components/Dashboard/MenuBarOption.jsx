import React from 'react'
import { useNavigate } from "react-router-dom";
import "./css/MenuBarOption.css"

import Calendar from "./images/calendar-days-regular.svg"
import Building from "./images/building-solid.svg"
import Store from "./images/store-solid.svg"
import Gear from "./images/gear-solid.svg"

const imageImports = {
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