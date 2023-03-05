import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import "../css/Calendar.css"

function MainCalendar() {
    const navigate = useNavigate()

    return ( 
    <div className='calendarMenuContainer'>
        <div className='subOptionsMenu'>               
            <div className='option' 
            style={{
                width: "50%",
            }}
            onClick={() => {
                navigate("./list")
            }}>
                <div className='text'>Időpontok</div>
                <div className='line left'></div>
            </div>
            <div className='option'  
            style={{
                width: "50%",
            }}
             onClick={() => {
                navigate("./notifications")
            }}>
                <div className='text'>Értesítések</div>
                <div className='line right'></div>
            </div>
        </div>


        <Outlet/>
    </div> 
    );
}

export default MainCalendar;