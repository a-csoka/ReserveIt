import React, { Component } from 'react';
import { Link, useLocation } from 'react-router-dom';


import "./css/PageBtn.css";

function App() {
    let location = useLocation();
    console.log(location.pathname)
}

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
            }
        }

    render() { 
        return (
            <React.Fragment>
                <div className='PageBtn' style={{
                    top: this.state.top,
                    bottom: this.state.bottom,
                    left: this.state.left,
                    right: this.state.right,                    
                }}>
                    <Link to={this.state.redirect}>{this.state.buttonText}</Link>
                    <div className='stateResponse'></div>
                </div>

            </React.Fragment>

        );
    }
}
 
export default PageBtn;
