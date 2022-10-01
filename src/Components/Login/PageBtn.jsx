import React, { Component } from 'react';

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
                buttonText: props.buttonText
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
                    {this.state.buttonText}
                    <div className='stateResponse'></div>
                </div>

            </React.Fragment>

        );
    }
}
 
export default PageBtn;
