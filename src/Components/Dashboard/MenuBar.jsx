import React from 'react';

import "./css/MenuBar.css"

import ReserveIt_OnlyText from "../Login/images/ReserveIt_OnlyText.png"

import User from "./images/user-solid.svg"

function MenuBar() {
    return ( 
    <React.Fragment>
        <div className='menuContainer'>
            <div className='background'/>
            <img src={ReserveIt_OnlyText} alt="Hiba a betöltés során!" className='ReserveItMenu'></img>
            
            <div className='optionsContainer'>

            </div>
        </div>
    </React.Fragment>
    )
}

export default MenuBar;
