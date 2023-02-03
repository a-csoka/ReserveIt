import React, { useEffect } from 'react';
import {useParams} from 'react-router';
import moment from 'moment'

import "./css/Calendar.css"
import { useState } from 'react';

const hours = [
    "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
]

function Calendar() {
    const [selDate, setSelDate] = useState(new Date())
    const {BusinessID} = useParams()
    const [workers, setWorkers] = useState([])
    const [reservations, setReservations] = useState([])

    function updateDate(date){
        console.log(moment(selDate).format('YYYY-MM-DD'))
        fetch("http://127.0.0.1:5000/getReservations",{
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({BusinessID: BusinessID, Time: moment(date).format('YYYY-MM-DD')})
        }).then((response) => response.json()).then(data => {
            setWorkers(data.workerData)
            setReservations(data.reservationData)
        })
    }

    useEffect(() => {
        updateDate(selDate)
    }, [setWorkers, setReservations])

    return (  
        <React.Fragment>
            <div className='dateSelector'>
                    <div className='dateContainer effect' onClick={() => {
                        setSelDate(new Date(selDate.getTime()-(2*24*60*60*1000)))
                        updateDate(new Date(selDate.getTime()-(2*24*60*60*1000)))
                    }}>
                        <span className='date'>{new Date(selDate.getTime()-(2*24*60*60*1000)).getFullYear()+". "+(new Date(selDate.getTime()-(2*24*60*60*1000)).getMonth()+1)+". "+new Date(selDate.getTime()-(2*24*60*60*1000)).getUTCDate()+"."}</span>
                        <span className='dayText'>{getDayName(new Date(selDate.getTime()-(2*24*60*60*1000)), "hu-HU")}</span>
                    </div>
                    <div className='dateContainer effect' onClick={() => {
                        setSelDate(new Date(selDate.getTime()-(1*24*60*60*1000)))
                        updateDate(new Date(selDate.getTime()-(1*24*60*60*1000)))
                    }}>
                        <span className='date'>{new Date(selDate.getTime()-(1*24*60*60*1000)).getFullYear()+". "+(new Date(selDate.getTime()-(1*24*60*60*1000)).getMonth()+1)+". "+new Date(selDate.getTime()-(1*24*60*60*1000)).getUTCDate()+"."}</span>
                        <span className='dayText'>{getDayName(new Date(selDate.getTime()-(1*24*60*60*1000)), "hu-HU")}</span>
                    </div>
                    <div className='dateContainer' style={{
                        backgroundColor: "#006b82",
                        cursor: "default",
                    }}>
                        <span className='date'>{selDate.getFullYear()+". "+(selDate.getMonth()+1)+". "+selDate.getDate()+"."}</span>
                        <span className='dayText'>{getDayName(selDate, "hu-HU")}</span>
                    </div>
                    <div className='dateContainer effect' onClick={() => {
                        setSelDate(new Date(selDate.getTime()+(1*24*60*60*1000)))
                        updateDate(new Date(selDate.getTime()+(1*24*60*60*1000)))
                    }}>
                        <span className='date'>{new Date(selDate.getTime()+(1*24*60*60*1000)).getFullYear()+". "+(new Date(selDate.getTime()+(1*24*60*60*1000)).getMonth()+1)+". "+new Date(selDate.getTime()+(1*24*60*60*1000)).getDate()+"."}</span>
                        <span className='dayText'>{getDayName(new Date(selDate.getTime()+(1*24*60*60*1000)), "hu-HU")}</span>
                    </div>
                    <div className='dateContainer effect' onClick={() => {
                        setSelDate(new Date(selDate.getTime()+(2*24*60*60*1000)))
                        updateDate(new Date(selDate.getTime()+(2*24*60*60*1000)))
                    }}>
                        <span className='date'>{new Date(selDate.getTime()+(2*24*60*60*1000)).getFullYear()+". "+(new Date(selDate.getTime()+(2*24*60*60*1000)).getMonth()+1)+". "+new Date(selDate.getTime()+(2*24*60*60*1000)).getDate()+"."}</span>
                        <span className='dayText'>{getDayName(new Date(selDate.getTime()+(2*24*60*60*1000)), "hu-HU")}</span>
                    </div>
            </div>
            <div className='calendarContainer'>
                {workers.map(function(worker, index){
                    return(
                        <div className='worker' key={worker.AccountID}><span>{worker.FirstName+" "+worker.LastName}</span></div>
                    )})
                }
                <div className='calendar'>
                    {hours.map(function(hour, index){
                        return(
                        <div className='hourLiner' key={index}>
                            <div className='hour'><span>{hour}</span></div>
                            <div className='line'/>
                            <div className='halfLine'/>
                        </div>)
                    })}

                    {
                        reservations.map(function(reservation, index){
                            for(var i = 0; i < workers.length; i++){
                                if(workers[i].AccountID === reservation.WorkerID){
                                    const minutes = parseInt(reservation.Start.split(":")[0]*60)+parseInt(reservation.Start.split(":")[1])
                                    return (
                                        <div className='reservationContainer' style={{
                                            left: "calc(5% + "+index*20+"%",
                                            top: "calc(1.5vh + "+minutes/60*15+"vh)",
                                            height: (reservation.Length/0.6/24)+"%",
                                        }} key={reservation.ReservationID}>
                                            <div className='name'>{reservation.Name}</div>
                                            <div className='time'>{reservation.Start+" - "+reservation.End}</div>
                                        </div>
                                    )
                                }
                            }
                        })
                    }
                </div>
            </div>
        </React.Fragment>
    );
}
export default Calendar;

function getDayName(dateStr)
{
    return dateStr.toLocaleDateString(dateStr, { weekday: 'long' });        
}