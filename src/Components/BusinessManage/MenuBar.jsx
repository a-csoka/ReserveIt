import React from 'react';

import "./css/MenuBar.css"

import ReserveIt_OnlyText from "../Login/images/ReserveIt_OnlyText.png"

import MenuBarOption from '../Dashboard/MenuBarOption';

function MenuBar() {
    return ( 
    <React.Fragment>
        <div className='menuContainer'>
            <div className='background'/>
            <img src={ReserveIt_OnlyText} alt="Hiba a betöltés során!" className='ReserveItMenu'></img>
            
            <div className='optionsContainer'>
                <MenuBarOption Text="Statisztika" Icon="Graph" To="./statistics"/>
                <MenuBarOption Text="Időpontok" Icon="Calendar" To="./calendar"/>
                <MenuBarOption Text="Dolgozók" Icon="User" To="./workers"/>
                <MenuBarOption Text="Beállítások" Icon="Gear" To="./settings"/>
                <MenuBarOption Text="Kilépés" Icon="Exit" To="./exit"/>
            </div>
        </div>
    </React.Fragment>
    )
}

export default MenuBar;