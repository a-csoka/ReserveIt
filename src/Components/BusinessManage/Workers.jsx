import React, { useState } from 'react';
import {useNavigate, useParams} from 'react-router';

import "./css/Workers.css"
import { useEffect } from 'react';

function Workers() {
    const {BusinessID} = useParams()
    const navigate = useNavigate()
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
    }, [setShowInvite])

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
        </div> 
        );
    }else{
        return ( 
        <div className='WorkersDiv'>
        
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
