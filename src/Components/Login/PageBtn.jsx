import React, { Component} from 'react';
import { Link } from 'react-router-dom';

import "./css/PageBtn.css";

class PageBtn extends Component {
    state = {  } 
        constructor(props){
            super(props)
            this.state = {
                top: props.top,
                bottom: props.bottom,
                left: props.left,
                right: props.right,
                buttonText: props.buttonText,
                redirect: props.redirect,
                active: props.active
            }
        }

    render() { 
        var response = (
        <React.Fragment>
            <Link to={this.state.redirect}>{this.state.buttonText}</Link>
            <div className='stateResponse'/>
        </React.Fragment>)

        if(this.state.active){
            response = (
                <React.Fragment>
                    <Link to={this.state.redirect} style={{color:"white"}}>{this.state.buttonText}</Link>
                    <div className='stateResponse' style={{width: "105%", backgroundColor: "white", left: "-2.5%"}}/>
                </React.Fragment>
            )
        
        }

        return (
            <React.Fragment>
                <div className='PageBtn' style={{
                    top: this.state.top,
                    bottom: this.state.bottom,
                    left: this.state.left,
                    right: this.state.right,                    
                }}>
                    {response}
                </div>

            </React.Fragment>

        );
    }
}

export default PageBtn;
