import React, { Component } from 'react';
import { Outlet } from 'react-router';

import "./css/Panel.css";





class Panel extends Component {
    state = {  } 
    render() { 
        return (
        <React.Fragment>           
            
            <div id="loginDiv">
                <div className="background"></div>
                <Outlet />
            </div>

        </React.Fragment>);
    }
}
 
export default Panel;
