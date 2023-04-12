import React,{useState, useEffect} from 'react';
import { useOutletContext } from 'react-router-dom';

import "../css/Notification.css"

function CalendarNotification() {
    const [notifications, setNotifications] = useState([])
    const [notiCount, updateNoti] = useOutletContext()

    useEffect(() => {
        fetch("http://127.0.0.1:5000/getNotifications", {
            method: "GET",
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
            }
        }).then((response) => response.json()).then(data => {
            setNotifications(data.payload)
        })
        updateNoti(0)
    }, [setNotifications])


    return ( 
    <div className='notificationContainer'>
        {notifications.map(function(notification, index){
            return(
            <div key={index} className='notification'>
                <div className='textContainer'><div className='companyname'>{notification.Name}</div>{" "+notification.Text}</div>
            </div>)
        })}
    </div> );
}

export default CalendarNotification;