import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import "../css/Calendar.css"

function MainCalendar() {
    const navigate = useNavigate()
    const [notiCount, setNotiCount] = useState(0)

    useEffect(() => {
        fetch("http://127.0.0.1:5000/getNotificationsCount", {
            method: "GET",
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
            }
        }).then((response) => response.json()).then(data => {
            setNotiCount(data.payload)
        })
    }, [setNotiCount])

    const updateNoti = (value) => {
        setNotiCount(value);
    };

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
                {(notiCount > 0 ? <div className='text'>Értesítések<div className='notificationCount'>{notiCount}</div></div> : <div className='text'>Értesítések</div>)}
                <div className='line right'></div>
            </div>
        </div>


        <Outlet context={[notiCount, updateNoti]}/>
    </div> 
    );
}

export default MainCalendar;