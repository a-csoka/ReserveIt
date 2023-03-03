import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import "../css/Calendar.css"

function MainCalendar() {
    const navigate = useNavigate()

    return ( 
    <div className='calendarMenuContainer'>
        <div className='subOptionsMenu'>               
            <div className='option' onClick={() => {
                navigate("./list")
            }}>
                <div className='text'>Vállalkozásaim</div>
                <div className='line left'></div>
            </div>
            <div className='option' onClick={() => {
                navigate("./invites")
            }}>
                <div className='text'>Meghívások</div>
                <div className='line right'></div>
            </div>
        </div>


        <Outlet/>
    </div> 
    );
}

export default MainCalendar;