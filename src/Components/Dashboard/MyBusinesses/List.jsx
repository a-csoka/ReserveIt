import React, { useEffect } from 'react';
import { useState } from 'react';

import "./css/List.css"

function List() {
    const [corps, setCorps] = useState([])

    useEffect(() => {
        fetch("http://127.0.0.1:5000/getOrganizations", {
            method: "GET",
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
            }
        }).then((response) => response.json()).then(data => {
            setCorps(data.payload)
        })
    }, [setCorps])

    return ( 
        <React.Fragment>
            {corps.map(function(corp, index){
                return(
                <div className='corpContainer' key={corp.BusinessID}>
                    <div className='dataContainer left'>      
                        <div><span className='makeBeauty'>Név: </span>{corp.Name}</div>
                        <div><span className='makeBeauty'>Cím: </span>{corp.Address}</div>
                        <div><span className='makeBeauty'>Tulajdonos: </span>{corp.OwnerName}</div>
                    </div>
                    <div className='dataContainer right'>
                        <div><span className='makeBeauty'>Email: </span>{corp.BusinessEmail}</div>
                        <div><span className='makeBeauty'>Telefonszám: </span>{corp.BusinessPhone}</div>
                    </div>
                </div>)
            })}
        </React.Fragment>
     );
}

export default List;
