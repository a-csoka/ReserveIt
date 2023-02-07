import React, { useEffect } from 'react';
import {useParams} from 'react-router';
import moment from 'moment'

import "./css/Calendar.css"
import { useState } from 'react';

const hours = [
    "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
]

var endWriteTimer

function Calendar() {
    const [selDate, setSelDate] = useState(new Date())
    const {BusinessID} = useParams()
    const [workers, setWorkers] = useState([])
    const [reservations, setReservations] = useState([])
    const [creatorLeft, setCreatorLeft] = useState("100%")

    const [reservationError, setReservationError] = useState("")
    const [reservationEditID, setReservationEditID] = useState(false)
    const [reservationName, setReservationName] = useState("")
    const [reservationWorkerID, setReservationWorkerID] = useState()
    const [reservationState, setReservationState] = useState("Pending")
    const [reservationDate, setReservationDate] = useState(moment(selDate).format('YYYY-MM-DD'))
    const [reservationStart, setReservationStart] = useState(moment(new Date()).format('HH:mm'))
    const [reservationEnd, setReservationEnd] = useState("23:59")
    const [reservationPrice, setReservationPrice] = useState(0)
    const [reservationEmail, setReservationEmail] = useState("")
    const [reservationFirstName, setReservationFirstName] = useState("")
    const [reservationLastName, setReservationLastName] = useState("")
    const [reservationPhone, setReservationPhone] = useState("")


    function updateDate(date){
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
            setReservationWorkerID(""+data.workerData[0].AccountID)
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
                        <span className='date'>{moment(new Date(selDate.getTime()-(2*24*60*60*1000))).format('YYYY. MM. DD.')}</span>
                        <span className='dayText'>{getDayName(new Date(selDate.getTime()-(2*24*60*60*1000)), "hu-HU")}</span>
                    </div>
                    <div className='dateContainer effect' onClick={() => {
                        setSelDate(new Date(selDate.getTime()-(1*24*60*60*1000)))
                        updateDate(new Date(selDate.getTime()-(1*24*60*60*1000)))
                    }}>
                        <span className='date'>{moment(new Date(selDate.getTime()-(1*24*60*60*1000))).format('YYYY. MM. DD.')}</span>
                        <span className='dayText'>{getDayName(new Date(selDate.getTime()-(1*24*60*60*1000)), "hu-HU")}</span>
                    </div>
                    <div className='dateContainer' style={{
                        backgroundColor: "#006b82",
                        cursor: "default",
                    }}>
                        <span className='date'>{moment(selDate).format('YYYY. MM. DD.')}</span>
                        <span className='dayText'>{getDayName(selDate, "hu-HU")}</span>
                    </div>
                    <div className='dateContainer effect' onClick={() => {
                        setSelDate(new Date(selDate.getTime()+(1*24*60*60*1000)))
                        updateDate(new Date(selDate.getTime()+(1*24*60*60*1000)))
                    }}>
                        <span className='date'>{moment(new Date(selDate.getTime()+(1*24*60*60*1000))).format('YYYY. MM. DD.')}</span>
                        <span className='dayText'>{getDayName(new Date(selDate.getTime()+(1*24*60*60*1000)), "hu-HU")}</span>
                    </div>
                    <div className='dateContainer effect' onClick={() => {
                        setSelDate(new Date(selDate.getTime()+(2*24*60*60*1000)))
                        updateDate(new Date(selDate.getTime()+(2*24*60*60*1000)))
                    }}>
                        <span className='date'>{moment(new Date(selDate.getTime()+(2*24*60*60*1000))).format('YYYY. MM. DD.')}</span>
                        <span className='dayText'>{getDayName(new Date(selDate.getTime()+(2*24*60*60*1000)), "hu-HU")}</span>
                    </div>
            </div>
            <div className='calendarContainer'>
                {workers.map(function(worker, index){
                    return(
                        <div className='worker' key={worker.AccountID}><span>{worker.FirstName+" "+worker.LastName}</span></div>
                    )})
                }
                <div className='calendar' onClick={() => {
                    setCreatorLeft("-100%")
                }}>
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
                                            left: "calc(5% + "+i*20+"%",
                                            top: "calc(1.5vh + "+minutes/60*15+"vh)",
                                            height: (reservation.Length/0.6/24)+"%",
                                        }} key={reservation.ReservationID} onClick={() => {
                                            setReservationEditID(reservation.ReservationID)
                                            setReservationName(reservation.Name)
                                            setReservationWorkerID(reservation.WorkerID)
                                            setReservationState(reservation.Status)
                                            setReservationDate(reservation.Date)
                                            setReservationStart(reservation.Start)
                                            setReservationEnd(reservation.End)
                                            setReservationPrice(reservation.Price)
                                            setReservationEmail(reservation.Email)
                                            setReservationPhone(reservation.Phone)
                                            fetch("http://127.0.0.1:5000/getUserFromEmail",{
                                                method: "POST",
                                                credentials: 'include',
                                                headers: {
                                                    'Content-type': 'application/json',
                                                },
                                                body: JSON.stringify({Email: reservation.Email})
                                            }).then((response) => response.json()).then(data => {
                                                setReservationFirstName(data.FirstName)
                                                setReservationLastName(data.LastName)
                                            })
                                            setCreatorLeft("-100%")
                                        }}>
                                            <div className='name'>{reservation.Name}</div>
                                            <div className='time'>{reservation.Start+" - "+reservation.End}</div>
                                        </div>
                                    )
                                }
                            }
                            return false
                        })
                    }
                </div>
            </div>

            <div className='reservationCreator' style={{
                transform: "translateX("+creatorLeft+")"
            }}>
                <div className='close' onClick={() => {
                    setCreatorLeft("0")
                    setReservationEditID(false)
                    setReservationName("")
                    setReservationWorkerID(workers[0].AccountID)
                    setReservationState("Pending")
                    setReservationDate(moment(selDate).format('YYYY-MM-DD'))
                    setReservationStart(moment(selDate).format('HH:mm'))
                    setReservationEnd("23:59")
                    setReservationPrice(0)
                    setReservationEmail("")
                    setReservationPhone("")
                    setReservationFirstName("")
                    setReservationLastName("")

                    }}><span>Bezárás</span></div>

                <div className='bigAsstTitle'>Foglalás{(reservationEditID !== false ? " - Szerkesztés" : "")}</div>
                <div className='title centered'>Foglalás neve</div>
                <input className='full' type="text" value={reservationName} onChange={(event) => {setReservationName(event.target.value)}}></input>

                <div className='title halfTitle'>Dolgozó</div>
                <div className='title halfTitle right'>Állapot</div>
                <select list="statuslist" className='half' value={reservationWorkerID} onChange={(event) => setReservationWorkerID(event.target.value)}>
                    {workers.map(function(worker, index){
                        return(
                            <option key={worker.AccountID} value={worker.AccountID}>{worker.FirstName+" "+worker.LastName}</option>
                        )})
                    }
                </select>

                <select list="statuslist" className='half' value={reservationState} onChange={(event) => setReservationState(event.target.value)}>
                    <option value="Pending">Feljegyezve</option>
                    <option value="Arrived">Megjelent</option>
                    <option value="Not arrived">Nem jelent meg</option>
                    <option value="Cancelled">Lemondva</option>
                </select>

                <div className='title centered'>Dátum</div>
                <input className='full' type="date" min={moment(new Date()).format('YYYY-MM-DD')} value={reservationDate} onChange={(event) => {setReservationDate(event.target.value)}}/>

                <div className='title halfTitle'>Kezdés</div>
                <div className='title halfTitle right'>Vége</div>
                <input type="time" className='half' value={reservationStart} onChange={(event) => setReservationStart(event.target.value)}/>
                <input type="time" className='half' value={reservationEnd} onChange={(event) => setReservationEnd(event.target.value)}/>

                <div className='title centered'>Ár</div>
                <input className='full' type="number" min="0" value={reservationPrice} onChange={(event) => setReservationPrice(event.target.value)}/>

                <div className='bigAsstTitle'>Vendég</div>

                <div className='title centered'>Email</div>
                <input className='full' type="email" value={reservationEmail} onChange={(event) => {
                    setReservationEmail(event.target.value)
                    clearTimeout(endWriteTimer);
                    endWriteTimer = setTimeout(() => {
                        fetch("http://127.0.0.1:5000/getUserFromEmail",{
                            method: "POST",
                            credentials: 'include',
                            headers: {
                                'Content-type': 'application/json',
                            },
                            body: JSON.stringify({Email: event.target.value})
                        }).then((response) => response.json()).then(data => {
                            setReservationFirstName(data.FirstName)
                            setReservationLastName(data.LastName)
                        })
                    }, 250)
                }} readOnly={(reservationEditID === false ? false : true)}></input>

                <div className='title halfTitle'>Vezetéknév</div>
                <div className='title halfTitle right'>Keresztnév</div>
                <input type="text" className='half' placeholder='Keresés...' value={reservationFirstName} readOnly/>
                <input type="text" className='half right' placeholder='Keresés...' value={reservationLastName} readOnly/>

                <div className='title centered'>Elérhetőség - Telefonszám</div>
                <input className='full' type="tel" value={reservationPhone} onChange={(event) => setReservationPhone(event.target.value)}></input>

                <div className='errorMessage' style={{color: (reservationError === "Időpont létrehozva!"? "#228B22" : "#8b2722")}}>{reservationError}</div>
                <button className='acceptButton' onClick={() => {
                    if(isFieldEmpty(reservationName)){
                        setReservationError("Add meg a foglalás nevét!")
                        return false
                    }
                    if(isFieldEmpty(""+reservationWorkerID)){
                        setReservationError("Add meg a foglalást végző dolgozót!")
                        return false
                    }
                    if(isFieldEmpty(reservationState)){
                        setReservationError("Add meg a foglalás állapotát!")
                        return false
                    }
                    if(isFieldEmpty(reservationStart)){
                        setReservationError("Add meg a foglalás kezdetét!")
                        return false
                    }
                    if(isFieldEmpty(reservationEnd)){
                        setReservationError("Add meg a foglalás végét!")
                        return false
                    }
                    if(typeof(parseInt(reservationPrice)) !== "number"){
                        setReservationError("Add meg a foglalás árát!")
                        return false
                    }
                    if(isFieldEmpty(reservationEmail)){
                        setReservationError("Add meg a vendég emal címét!")
                        return false
                    }
                    if(isFieldEmpty(reservationFirstName) || isFieldEmpty(reservationLastName)){
                        setReservationError("Ehhez az email címhez nincs társítva fiók!")
                        return false
                    }
                    if((new Date(reservationDate+" "+reservationStart)).getTime() >= (new Date(reservationDate+" "+reservationEnd)).getTime()){
                        setReservationError("A foglalás vége nem lehet korábban, mint a kezdete!")
                        return false
                    }
                    if(moment(reservationDate+" "+reservationStart).isSameOrBefore(new Date())){
                        setReservationError("A foglalás ideje nem lehet kisebb mint a jelenlegi!")
                        return false
                    }
                    setReservationError("")
                    if(reservationEditID === false){
                        fetch("http://127.0.0.1:5000/addReservation",{
                            method: "POST",
                            credentials: 'include',
                            headers: {
                                'Content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                BusinessID: BusinessID,
                                Name: reservationName,
                                WorkerID: ""+reservationWorkerID,
                                Date: reservationDate,
                                Start: reservationStart,
                                End: reservationEnd,
                                Price: reservationPrice,
                                Email: reservationEmail,
                                Phone: reservationPhone
                            })
                        }).then((response) => response.json()).then(data => {
                            setReservationError(data.errorMsg)
                            updateDate(new Date(selDate))
                        })
                    }else{
                        fetch("http://127.0.0.1:5000/editReservation",{
                            method: "POST",
                            credentials: 'include',
                            headers: {
                                'Content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                ReservationID: reservationEditID,
                                BusinessID: BusinessID,
                                Name: reservationName,
                                WorkerID: ""+reservationWorkerID,
                                Date: reservationDate,
                                Start: reservationStart,
                                End: reservationEnd,
                                Price: reservationPrice,
                                Phone: reservationPhone,
                                State: reservationState
                            })
                        }).then((response) => response.json()).then(data => {
                            setReservationError(data.errorMsg)
                            updateDate(new Date(selDate))
                        })
                    }
                    

                }}>{(reservationEditID !== false ?  "szerkesztés" : "Hozzáadás")}</button>
            </div>
        </React.Fragment>
    );
}
export default Calendar;

function getDayName(dateStr)
{
    return dateStr.toLocaleDateString(dateStr, { weekday: 'long' });        
}

function isFieldEmpty(text){
    if(typeof(text) !== "undefined"){
        if(text.replace(" ", "") !== ""){
            return false
        }
    }
    return true
}