import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";

import "./css/Invites.css"

function Invites() {
    const navigate = useNavigate()
    const [invites, setInvites] = useState([])

    function handleResponse(response, BusinessID){
        fetch("http://127.0.0.1:5000/respondToInvite",{                
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({Response: response,BusinessID: BusinessID})
        }).then((response) => response.json()).then(data => {
            if(data.redirect === "accept"){
                navigate("./list")
            }else{
                fetch("http://127.0.0.1:5000/getBusinessInvites",{                
                    method: "GET",
                    credentials: 'include',
                    headers: {
                        'Content-type': 'application/json',
                    },
                }).then((response) => response.json()).then(data => {
                    setInvites(data.payload)
                })
            }
        })
    }

    useEffect(() => {
        fetch("http://127.0.0.1:5000/getBusinessInvites",{                
            method: "GET",
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
            },
        }).then((response) => response.json()).then(data => {
            setInvites(data.payload)
        })
    }, [setInvites])

    if(invites.length === 0){
        return ( 
            <div className='noInvText'>Még nem kaptál megívót!</div>
        );
    }else{
        return ( 
            <React.Fragment>
            {invites.map(function(invite, index){
                return(
                <div className='corpContainer' key={invite.BusinessID} style={{
                    cursor: "default",
                    backgroundColor: "#C8C8C8"
                }}>
                    <div className='inviterBusinessName'>{invite.Name}</div>
                    <div className='inviterName'><span className='colorful'>Meghívó:</span> {invite.FirstName+" "+invite.LastName}</div>
                    <div className='choiceBtn acceptDiv' onClick={() => {handleResponse("accept", invite.BusinessID)}}><span className='center'>Elfogadás</span></div>
                    <div className='choiceBtn refuseDiv' onClick={() => {handleResponse("deny", invite.BusinessID)}}><span className='center'>Elutasítás</span></div>
                </div>)
            })}
            </React.Fragment>
        );
    }
}

export default Invites;
