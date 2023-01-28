import React, { useEffect} from 'react';
import { Outlet, useNavigate, useParams} from 'react-router';
import MenuBar from './MenuBar';

import "./css/BusinessManage.css"

function BusinessManage() {
    const {BusinessID} = useParams()
    const navigate = useNavigate();


    useEffect(() => {
        fetch("http://127.0.0.1:5000/isOrganizationAuthorized",{
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({BusinessID: BusinessID})
        }).then((response) => response.json()).then(data => {
            if(!data.authorized){
                navigate("../../dashboard/mycalendar")
            }
        })
    })

    return ( 
        <div className='businessManageContainer'>
            <div className='menuDashContainer'>
                <MenuBar />
            </div>
            <div className='contentContainer'>
                <Outlet />
            </div>
                
        </div>
     );
}

export default BusinessManage;