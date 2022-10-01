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

        if(props.imageSrc == null) {
            this.indent = "0";
        }else{
            this.indent = "1.75";
        }

        this.state = {
            left: props.left,
            width: props.width,
            top: props.top,
            height: props.height,
            type: props.type,
            placeholder: props.placeholder,
            image: props.imageSrc,
            textIndent: this.indent,
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
            <input type={this.state.type} placeholder={this.state.placeholder} style={{
                textIndent: "3vw",
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
 
