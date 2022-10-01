import React, { Component} from 'react';
import { Link } from 'react-router-dom';

import "./css/PageBtn.css";

class PageBtn extends Component {
    state = {
        update: false,
    }


    componentDidMount(){
        this.setState({
            top: this.props.top,
            bottom: this.props.bottom,
            left: this.props.left,
            right: this.props.right,
            buttonText: this.props.buttonText,
            redirect: this.props.redirect,
            refresher: this.props.refresher,
        })
    }



    render() { 
        var response = (
        <React.Fragment>
            <Link to={this.state.redirect} onClick={() => this.state.refresher()}>{this.state.buttonText}</Link>
            <div className='stateResponse'/>
        </React.Fragment>)

        if(window.location.pathname === this.state.redirect){
            response = (
                <React.Fragment>
                    <Link to={this.state.redirect} style={{color:"white"}} onClick={() => this.state.refresher()}>{this.state.buttonText}</Link>
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
