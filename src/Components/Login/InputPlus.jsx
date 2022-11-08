import React, { Component } from 'react';

import "./css/InputPlus.css";
import atSolid from "./images/at-solid.svg";
import keySolid from "./images/key-solid.svg";

const imageImports = {
    ["Email"]: <img src={atSolid} alt="Hiba a betöltés során!"></img>,
    ["Key"]: <img src={keySolid} alt="Hiba a betöltés során!"></img>,
}

class InputPlus extends Component {
    state = {}


    componentDidMount(){
        var indent = 0
        if(this.props.imageSrc === undefined) {
            indent = "0";
        }else{
            indent = "3vw";
        }


        this.setState({
            textIndent: indent,
        })

        this.activateError()
    }

    activateError = () => {
        if(this.props.ErrorMsg){
            this.setState({
                effect: "100%",
                bgColor: "red",
            })
        }else{
            this.setState({
                effect: null,
                bgColor: null,
            })
        }
    }

    componentDidUpdate(previousProps, previousState) {
        if (previousProps.ErrorMsg !== this.props.ErrorMsg) {
            this.activateError()
        }
       }

    render() { 
        var errorText
        if(this.props.ErrorMsg){
            errorText = <div className='errorMsg'>{this.props.ErrorMsg}</div>
        }

        return (
        <div className="InputTypeOne" style={{
            left: this.props.left,
            width: this.props.width,
            top: this.props.top,
            height: this.props.height,
        }}>
            {imageImports[this.props.imageSrc]}
            <input autoComplete={this.props.autocompleteID} type={this.props.type} placeholder={this.props.placeholder} style={{
                textIndent: this.state.textIndent,
            }} onChange={event => {this.props.dataSet(event.target.value); this.setState({effect: null, bgColor: null}); this.activateError()}}></input>
            <div className='lowLine'>
                <div className='effect' style={{
                    width: this.state.effect,
                    backgroundColor: this.state.bgColor,
                }}/>
            </div>
            {errorText}
        </div>);
    }
}

export default InputPlus;
 
