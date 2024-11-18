import React, { useState, useEffect } from 'react';
import { P } from 'antd';

const Productos = () => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/producto')
            .then((response) => response.json())
            .then((data) => setProductos(data))
            .catch((error) => console.error('Error al obtener los productos:', error));
    }, []);

    return (
        <div>
            <h1>Productos</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {productos.map((producto) => (
                    <div
                        key={producto.id_producto}
                        style={{
                            border: '1px solid #ccc',
                            padding: '10px',
                            borderRadius: '8px',
                            maxWidth: '300px',
                        }}
                    >
                        <img
                            src={producto.imagen_url}
                            alt={producto.nombre_producto}
                            style={{ width: '100%', borderRadius: '8px' }}
                        />
                        <h2>{producto.nombre_producto}</h2>
                        <p>{producto.descripcion}</p>
                        <p><strong>Precio:</strong> ${producto.precio}</p>
                        <p><strong>Piezas disponibles:</strong> {producto.piezas}</p>
                        <p>
                            <strong>Temporada:</strong> {producto.temporada} <br />
                            
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Productos;
