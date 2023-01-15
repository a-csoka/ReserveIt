import React from 'react';

import "./css/MyBusinesses.css"

function MyBusinesses() {
    return (
        <React.Fragment>
            <div className='contentBackground'></div>

            <div className='subOptionsMenu'>               
                <div className='option'>
                    <div className='text'>Vállalkozásaim</div>
                    <div className='line left'></div>
                </div>
                <div className='option'>
                    <div className='text'>Vállalkozás létrehozása</div>
                    <div className='line'></div>
                </div>
                <div className='option'>
                    <div className='text'>Meghívások</div>
                    <div className='line right'></div>
                </div>
            </div>
                
        </React.Fragment>    
    );
}

export default MyBusinesses;