import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Error 404</h1>
            <p>No se encontró el sprint solicitado.</p>
            <button onClick={() => navigate('/')} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                Volver al inicio
            </button>
        </div>
    );
};
