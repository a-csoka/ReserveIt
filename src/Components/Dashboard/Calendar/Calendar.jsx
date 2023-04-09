import React, { useEffect, useState } from 'react';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

const hours = [
    "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
]

var endWriteTimer

function CalendarCalendar() {
    const [selDate, setSelDate] = useState(new Date())
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
        fetch("http://127.0.0.1:5000/getUserReservations",{
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({Time: moment(date).format('YYYY-MM-DD')})
        }).then((response) => response.json()).then(data => {
            if(reservationWorkerID === null){
                setReservationWorkerID(data.workerData[0].WorkerName)
            }
            data.reservationData.map(function(reservation, index){
                reservation.col = 1
            })
            data.reservationData.map(function(reservation, index){
                data.reservationData.forEach(function(element){
                    if(reservation !== element){
                        if(reservation.col === element.col){
                            const range  = moment.range([moment(reservation.Date+" "+reservation.Start), moment(reservation.Date+" "+reservation.End)]);
                            const range2 = moment.range([moment(element.Date+" "+element.Start), moment(element.Date+" "+element.End)]);
                            if(range.overlaps(range2)){
                                element.col = element.col+1
                            }
                        }
                    }
                })
            })
            setReservations(data.reservationData)
        })
    }

    useEffect(() => {
        updateDate(selDate)
    }, [setReservations, setReservationWorkerID])

    return ( 
    <React.Fragment>
        <div className='dateSelector' style={{top: "15%"}}>
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
        <div className='calendarContainer' style={{top: "20.8%",height: "71.5%"}}>
                <div className='calendar' style={{top: "0"}}>
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
                            const minutes = parseInt(reservation.Start.split(":")[0]*60)+parseInt(reservation.Start.split(":")[1])
                            return (
                                <div className='reservationContainer' style={{
                                    top: "calc(1.5vh + "+minutes/60*15+"vh)",
                                    height: (reservation.Length/0.6/24)+"%",
                                    left: "calc(5% + "+(reservation.col-1)*20+"%",
                                    backgroundColor: (getColorFromStatus(reservation.Status, reservation.Date, reservation.End))
                                }} key={reservation.ReservationID} onClick={() => {
                                    setReservationEditID(reservation.ReservationID)
                                    setReservationName(reservation.Name)
                                    setReservationWorkerID(reservation.WorkerName)
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
                    setReservationWorkerID("")
                    setReservationState("Pending")
                    setReservationDate(moment(selDate).format('YYYY-MM-DD'))
                    setReservationStart(moment(selDate).format('HH:mm'))
                    setReservationEnd("23:59")
                    setReservationPrice(0)
                    setReservationEmail("")
                    setReservationPhone("")
                    setReservationFirstName("")
                    setReservationLastName("")
                    setReservationError("")

                    }}><span>Bezárás</span></div>

                <div className='bigAsstTitle'>Foglalás</div>
                <div className='title centered'>Foglalás neve</div>
                <input readOnly className='full' type="text" value={reservationName} onChange={(event) => {setReservationName(event.target.value)}}></input>

                <div className='title halfTitle'>Dolgozó</div>
                <div className='title halfTitle right'>Állapot</div>
                <input readOnly className='half' value={reservationWorkerID}/>


                <select disabled list="statuslist" className='half' value={reservationState} onChange={(event) => setReservationState(event.target.value)}>
                    <option value="Pending">Feljegyezve</option>
                    <option value="Arrived">Megjelent</option>
                    <option value="Not arrived">Nem jelent meg</option>
                    <option value="Cancelled">Lemondva</option>
                </select>

                <div className='title centered'>Dátum</div>
                <input readOnly className='full' type="date" min={moment(new Date()).format('YYYY-MM-DD')} value={reservationDate} onChange={(event) => {setReservationDate(event.target.value)}}/>

                <div className='title halfTitle'>Kezdés</div>
                <div className='title halfTitle right'>Vége</div>
                <input readOnly type="time" className='half' value={reservationStart} onChange={(event) => setReservationStart(event.target.value)}/>
                <input readOnly type="time" className='half' value={reservationEnd} onChange={(event) => setReservationEnd(event.target.value)}/>

                <div className='title centered'>Ár</div>
                <input readOnly className='full' type="number" min="0" value={reservationPrice} onChange={(event) => setReservationPrice(event.target.value)}/>

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
                }} readOnly></input>

                <div className='title halfTitle'>Vezetéknév</div>
                <div className='title halfTitle right'>Keresztnév</div>
                <input type="text" className='half' placeholder='Keresés...' value={reservationFirstName} readOnly/>
                <input type="text" className='half right' placeholder='Keresés...' value={reservationLastName} readOnly/>

                <div className='title centered'>Elérhetőség - Telefonszám</div>
                <input readOnly className='full' type="tel" value={reservationPhone} onChange={(event) => setReservationPhone(event.target.value)}></input>

                <div className='errorMessage' style={{color: ((reservationError === "Foglalás létrehozva!" || reservationError === "Foglalás szerkesztve!") ? "#228B22" : "#8b2722")}}>{reservationError}</div>
            </div>        
    </React.Fragment> );
}
export default CalendarCalendar;

function getDayName(dateStr)
{
    return dateStr.toLocaleDateString(dateStr, { weekday: 'long' });        
}

function getColorFromStatus(status, date, end){
    switch(status){
        case "Pending":{
            if(moment(new Date()).isAfter(new Date(date+" "+end))){
                return "orange"
            }
            return "#00c5f0"
        }
        case "Arrived": return "#006b82"
        case "Not arrived": return "#8b2722"
        case "Cancelled": return "gray"
        default: return "#00c5f0"
    }    
}
