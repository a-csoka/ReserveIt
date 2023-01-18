import React from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import "./css/MyBusinesses.css"


function MyBusinesses() {
    const navigate = useNavigate();

    return (
        <React.Fragment>
            <div className='contentBackground'></div>

            <div className='subOptionsMenu'>               
                <div className='option' onClick={() => {
                    navigate("./list")
                }}>
                    <div className='text'>Vállalkozásaim</div>
                    <div className='line left'></div>
                </div>
                <div className='option'onClick={() => {
                    navigate("./create")
                }}>
                    <div className='text'>Vállalkozás létrehozása</div>
                    <div className='line'></div>
                </div>
                <div className='option' onClick={() => {
                    navigate("./invites")
                }}>
                    <div className='text'>Meghívások</div>
                    <div className='line right'></div>
                </div>
            </div>
            <div className='myBusinessContent'>
                <Outlet />
            </div>
                
        </React.Fragment>    
    );
}

export default MyBusinesses;