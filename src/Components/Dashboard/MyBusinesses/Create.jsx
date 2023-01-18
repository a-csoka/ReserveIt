import React from 'react';

function MyBusinessesCreate() {
    return ( 
    <React.Fragment>
        <div>Cég</div>
        <input placeholder='Vállalkozás neve' />
        <input placeholder='Bejegyzett cím'/>
        <input placeholder='Cégjegyzékszám'/>
        <input placeholder='Elérhetőség - Email' type="email"/>
        <input placeholder='Elérhetőség - Telefonszám(nem kötelező)' type="tel" name="phone"/>

        <div>Tulajdonos</div>
        <input placeholder='Tulajdonos neve'/>
        <input placeholder='Email' type="email"/>
        <input placeholder='Telefonszáma' type="tel" name="phone"/>
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
