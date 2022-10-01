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
            left: props.left,
            width: props.width,
            top: props.top,
            height: props.height,
            type: props.type,
            placeholder: props.placeholder,
            image: props.imageSrc,
            textIndent: indent,
            autocomplete: this.props.autocompleteID
        }
    }


    render() { 

        return (
        <div className="InputTypeOne" style={{
            left: this.state.left,
            width: this.state.width,
            top: this.state.top,
            height: this.state.height,
        }}>
            {imageImports[this.state.image]}
            <input autoComplete={this.state.autocomplete} type={this.state.type} placeholder={this.state.placeholder} style={{
                textIndent: this.state.textIndent,
            }}></input>
            <div className='lowLine'>
                <div className='effect' style={{
                    width: this.state.effect,
                }}/>
            </div>
        </div>);
    }
}

export default InputPlus;
 
