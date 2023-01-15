import React from 'react';
import { Outlet } from 'react-router';
import MenuBar from './MenuBar';

import "./css/Dashboard.css"

function Dasboard() {
    return ( 
        <div className='dashboardContainer'>
            <div className='menuDashContainer'>
                <MenuBar />
            </div>
            <div className='contentContainer'>
                <Outlet />
            </div>
                
        </div>
     );
}

export default Dasboard;