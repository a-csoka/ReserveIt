import React, { Component } from 'react';

import "./css/InputPlus.css";
import atSolid from "./images/at-solid.svg";
import keySolid from "./images/key-solid.svg";

const imageImports = {
    ["Email"]: <img src={atSolid} alt="Hiba a betöltés során!"></img>,
    ["Key"]: <img src={keySolid} alt="Hiba a betöltés során!"></img>,
}

class InputPlus extends Component {
    constructor(props){
        super(props)
        var indent = 0
        if(props.imageSrc === undefined) {
            indent = "0";
        }else{
            indent = "3vw";
        }


        this.state = {
            textIndent: indent,
        }
    }


    render() { 

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
            }} onChange={event => {this.props.dataSet(event.target.value)}}></input>
            <div className='lowLine'>
                <div className='effect' style={{
                    width: this.state.effect,
                }}/>
            </div>
        </div>);
    }
}

export default InputPlus;
 
