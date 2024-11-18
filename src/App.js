import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Productos from './Productos'; 
import Agregar from './Agregar';
import Eliminar from './Eliminar';
import Actualizar from './Actualizar';
import Temporada from './Temporada';

const App = () => {
    return (
        <Router>
            <div>
                <header style={{ padding: '20px', textAlign: 'center', backgroundColor: '#282c34', color: 'white' }}>
                    <h1>Panaderia</h1>
                    <nav style={{ marginTop: '10px' }}>
                        <Link to="/" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>Productos</Link>
                        <Link to="/agregar" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>Agregar</Link>
                        <Link to="/eliminar" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>Eliminar</Link>
                        <Link to="/actualizar" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>Actualizar</Link>
                        <Link to="/temporada" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>Temporada</Link>
                    </nav>
                </header>
                <main style={{ padding: '20px' }}>
                    <Routes>
                        <Route path="/" element={<Productos />} />
                        <Route path="/agregar" element={<Agregar />} />
                        <Route path="/eliminar" element={<Eliminar />} />
                        <Route path="/actualizar" element={<Actualizar />} />
                        <Route path="/temporada" element={<Temporada />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
