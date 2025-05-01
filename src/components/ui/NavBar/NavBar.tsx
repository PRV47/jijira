import React from 'react'
//NavBar de la aplicacion. aun no esta terminado
export const NavBar = () => {
    return (
        <>
            <div className="navBarLogo">
                <h1>JIJIRA</h1>
            </div>
            <div className="navBarMenu" >
                <ul style={{ display: 'flex', gap: '20px', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', listStyle: 'none', margin: '0', padding: '0' }}>
                    <li>Ramiro Ferrari</li>
                    <li>Nazareno Fioretti</li>
                    <li>Piers Rideout</li>
                </ul>
            </div>
        </>
    )
}