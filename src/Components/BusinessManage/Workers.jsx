import React, { useState } from 'react';
import {useParams} from 'react-router';

import "./css/Workers.css"
import { useEffect } from 'react';

function Workers() {
    const {BusinessID} = useParams()
    const [showInvite, setShowInvite] = useState(false)
    const [inviteEmail, setInviteEmail] = useState("")
    const [inviteError, setInviteError] = useState("")
    const [workers, setWorkers] = useState([])

    useEffect(() => {
        fetch("http://127.0.0.1:5000/isOrganizationAuthorized",{
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({BusinessID: BusinessID})
        }).then((response) => response.json()).then(data => {
            if(data.isOwner === 1){
                setShowInvite(true)
            }
        })

        fetch("http://127.0.0.1:5000/getWorkers",{
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({BusinessID: BusinessID})
        }).then((response) => response.json()).then(data => {
            setWorkers(data.payload)
        })
    }, [setShowInvite, setWorkers])

    if(showInvite){
        return ( 
            <div className='WorkersDiv'>
                <div className='inviteFieldText'>Meghívás</div>
                <input placeholder='Email' type="email" className='inviteInput' onChange={(event) => {setInviteEmail(event.target.value)}}/>
                <div className='inviteError'>{inviteError}</div>
                <button className='inviteButton' onClick={() => {
                    if(isFieldEmpty(inviteEmail)){
                        setInviteError("Üres mező!")
                        return false
                    }
                    
                    fetch("http://127.0.0.1:5000/inviteWorker",{                
                        method: "POST",
                        credentials: 'include',
                        headers: {
                            'Content-type': 'application/json',
                        },
                        body: JSON.stringify({BusinessID: BusinessID, Email: inviteEmail})
                    }).then((response) => response.json()).then(data => {
                        setInviteError(data.Err)
                    })
                }}>Küldés</button>

                {workers.map(function(worker, index){
                    return(
                        <div className='workerContainer' key={worker.AccountID}>
                            <div className='workerName'>{worker.FirstName+" "+worker.LastName}</div>
                            <div className='workerTitle'>{(worker.isOwner === 1 ? "Tulajdonos" : "Dolgozó")}</div>
                            <button className='kickBtn' style={{
                                display: (worker.isOwner === 0 ? "" : "none")
                            }} onClick={() => {
                                fetch("http://127.0.0.1:5000/removeWorker",{                
                                    method: "DELETE",
                                    credentials: 'include',
                                    headers: {
                                        'Content-type': 'application/json',
                                    },
                                    body: JSON.stringify({BusinessID: BusinessID, KickID: worker.AccountID})
                                }).then(() => {
                                    fetch("http://127.0.0.1:5000/getWorkers",{
                                        method: "POST",
                                        credentials: 'include',
                                        headers: {
                                            'Content-type': 'application/json',
                                        },
                                        body: JSON.stringify({BusinessID: BusinessID})
                                    }).then((response) => response.json()).then(data => {
                                        setWorkers(data.payload)
                                    })
                                })
                            }}>Kirúgás</button>
                        </div>
                    )
                })}
            </div> 
        );
    }else{
        return ( 
        <div className='WorkersDiv'>
            {workers.map(function(worker, index){
                return(
                    <div className='workerContainer' key={worker.AccountID}>
                        <div className='workerName'>{worker.FirstName+" "+worker.LastName}</div>
                        <div className='workerTitle'>{(worker.isOwner === 1 ? "Tulajdonos" : "Dolgozó")}</div>
                    </div>
                )
            })}
        </div> 
        );
    }

}
export default Workers;

function isFieldEmpty(text){
    if(typeof(text) !== "undefined"){
        if(text.replace(" ", "") !== ""){
            return false
        }
    }
    return true
}
