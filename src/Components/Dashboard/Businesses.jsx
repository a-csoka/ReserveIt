import React,{useState, useEffect} from 'react';

import "./css/Businesses.css"

function Businesses() {
    const [corps, setCorps] = useState([])
    const [showCorps, setShowCorps] = useState([])

    useEffect(() => {
        fetch("http://127.0.0.1:5000/getAllOrganizations", {
            method: "GET",
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
            }
        }).then((response) => response.json()).then(data => {
            setCorps(data.payload)
            setShowCorps(data.payload)
        })
    }, [setCorps, setShowCorps])

    return ( 
        <div className='businessesDiv'>
            <div className='searchFieldText'>Kereső</div>
            <input type="text" placeholder='Kereső' className='searchInput' onChange={(event) => {
                var temp = []
                for(var i in corps){
                    if(corps[i].Name.toLowerCase().includes(event.target.value.toLowerCase())){
                        temp.push(corps[i])
                    }
                }
                setShowCorps(temp)
            }}></input>

            {showCorps.map(function(corp, index){
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
        </div>
    );
}

export default Businesses;