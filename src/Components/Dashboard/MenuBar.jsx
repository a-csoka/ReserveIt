import React from 'react';

import "./css/MenuBar.css"

import ReserveIt_OnlyText from "../Login/images/ReserveIt_OnlyText.png"

import MenuBarOption from './MenuBarOption';

function MenuBar() {
    return ( 
    <React.Fragment>
        <div className='menuContainer'>
            <div className='background'/>
            <img src={ReserveIt_OnlyText} alt="Hiba a betöltés során!" className='ReserveItMenu'></img>
            
            <div className='optionsContainer'>
                <MenuBarOption Text="Időpontjaim" Icon="Calendar" To="./mycalendar"/>
                <MenuBarOption Text="Vállalkozások" Icon="Store" To="./businesses"/>
                <MenuBarOption Text="Saját vállalkozásaim" Icon="Building" To="./mybusinesses/list"/>
                <MenuBarOption Text="Beállítások" Icon="Gear" To="./settings"/>
            </div>
        </div>
    </React.Fragment>
    )
}

export default MenuBar;
