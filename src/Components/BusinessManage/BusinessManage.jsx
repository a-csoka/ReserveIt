import React from 'react';
import { Outlet } from 'react-router';
import MenuBar from './MenuBar';

import "./css/BusinessManage.css"

function BusinessManager() {
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

export default BusinessManager;