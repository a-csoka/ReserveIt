import React from 'react';

import "./css/Create.css"

function MyBusinessesCreate() {
    return ( 
    <React.Fragment>
        <div className='BigTitle'>Cég</div>
        <div className='SmollTitle'>Vállalkozás neve</div>
        <input placeholder='Vállalkozás neve' />

        <div className='SmollTitle'>Bejegyzett cím</div>
        <input placeholder='Bejegyzett cím'/>

        <div className='SmollTitle'>Cégjegyzékszám</div>
        <input placeholder='Cégjegyzékszám'/>

        <div className='SmollTitle'>Adószám</div>
        <input placeholder='Adószám'/>

        <div className='SmollTitle'>Elérhetőség - Email</div>
        <input placeholder='Elérhetőség - Email' type="email"/>

        <div className='SmollTitle'>Elérhetőség - Telefonszám (nem kötelező)</div>
        <input placeholder='Elérhetőség - Telefonszám (nem kötelező)' type="tel" name="phone"/>

        <div className='BigTitle'>Tulajdonos</div>

        <div className='SmollTitle'>Neve</div>
        <input placeholder='Neve'/>

        <div className='SmollTitle'>Email</div>
        <input placeholder='Email' type="email"/>

        <div className='SmollTitle'>Telefonszám</div>
        <input placeholder='Telefonszám' type="tel" name="phone"/>

        <button className='createBtn'>Létrehozás</button>
        <div className='space'></div>
    </React.Fragment> 
    );
}

/*
    Vállakozás neve
    Telefonszám
    Email cím
    Tulajdonos neve

    Elérhetőség
    Bejegyzett cím
    Cégjegyzékszám

*/

export default MyBusinessesCreate;
