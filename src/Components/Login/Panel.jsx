import React, { Component } from 'react';
import { Outlet } from 'react-router';

import PageBtn from "./PageBtn"
import ReserveIt_Text from "./images/ReserveIt_OnlyText.png"

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
                <div className='ReserveIt_Icon'>
                    <img src={ReserveIt_Text} alt="Hiba a betöltés során!"></img>
                </div>
                <Outlet />
                <PageBtn buttonText="Bejelentkezés" left="25%" top="15%" redirect="/login" refresher={this.refresher}/>
                <PageBtn buttonText="Regisztráció"  right="25%" top="15%" redirect="/register" refresher={this.refresher}/>
            </div>
        </React.Fragment>);
    }
}
 
export default Panel;
