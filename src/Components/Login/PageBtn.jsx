import React from 'react';
import { useNavigate } from "react-router-dom";

import "./css/PageBtn.css";

export default function PageBtn(props){
    const navigate = useNavigate();
    var response = (
    <React.Fragment>
        <p>{props.buttonText}</p>
        <div className='stateResponse'/>
    </React.Fragment>)

    if(window.location.pathname === props.redirect){
        response = (
            <React.Fragment>
                <p style={{color:"white"}}>{props.buttonText}</p>
                <div className='stateResponse' style={{width: "105%", backgroundColor: "white", left: "-2.5%"}}/>
            </React.Fragment>
        ) 
    }

    return (
         <React.Fragment>
            <div className={'PageBtn '+props.pos}
            onClick={() => {
                navigate(props.redirect)
            }}>    
            {response}
            </div>
        </React.Fragment>
    );
}
