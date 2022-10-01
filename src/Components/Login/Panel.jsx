import React, { Component } from 'react';
import { Outlet } from 'react-router';

import PageBtn from "./PageBtn"

import "./css/Panel.css";





class Panel extends Component {
    state = {
    }

    refresher = () => {
        this.setState(() => ({}))
    }

    render() { 
        return (
        <React.Fragment>           
            
            <div id="loginDiv">
                <div className="background"></div>
                <Outlet />
                <PageBtn buttonText="Bejelentkezés" left="25%" top="15%" redirect="/" refresher={this.refresher}/>
                <PageBtn buttonText="Regisztráció"  right="25%" top="15%" redirect="/register" refresher={this.refresher}/>
            </div>

        </React.Fragment>);
    }
}
 
export default Panel;
