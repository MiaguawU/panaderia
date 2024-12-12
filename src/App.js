import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Productos from './Productos';
import ProductosCliente from './ProuctosCliente';
import ProductoVista from './ProductosVista';
import Agregar from './Agregar';
import Actualizar from './Actualizar';
import Temporada from './Temporada';
import Acceder from './vistas/Acceder';
import Usuarios from './vistas/Users';
import Carrito from './Carrito';
import Perfil from './vistas/Usuario';
import HistorialCompras from './vistas/Historial';
import Ticket from './vistas/Ticket';
import axios from 'axios';
import PUERTO from './Config';
import Historial from './vistas/HistorialAdmin';

const NavClienteSinSesion = () => (
  <nav style={styles.nav}>
    <Link to="/" style={styles.link}>Productos</Link>
    <Link to="/acceder" style={styles.link}>Acceder</Link>
  </nav>
);

const NavAdministrador = () => (
  <nav style={styles.nav}>
    <Link to="/" style={styles.link}>Productos</Link>
    <Link to="/users" style={styles.link}>Usuarios</Link>
    <Link to="/perfil" style={styles.link}>Perfil</Link>
  </nav>
);

const NavClienteConSesion = () => (
  <nav style={styles.nav}>
    <Link to="/" style={styles.link}>Productos</Link>
    <Link to="/carrito" style={styles.link}>Carrito</Link>
    <Link to="/historial" style={styles.link}>Historial de Compras</Link>
    <Link to="/perfil" style={styles.link}>Perfil</Link>
  </nav>
);

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const obtenerDatosUsuario = async () => {
    try {
      const currentUserId = localStorage.getItem('currentUser');
      if (!currentUserId) {
        setCurrentUser(null);
        return;
      }

      const response = await axios.get(`${PUERTO}/cliente/${currentUserId}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data && response.data.length > 0) {
        const userData = response.data[0];
        setCurrentUser({ id: userData.id, id_rol: userData.id_rol });
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    obtenerDatosUsuario();
  }, []);

  const renderNav = () => {
    if (!currentUser) return <NavClienteSinSesion />;
    if (currentUser.id_rol === 1) return <NavAdministrador />;
    if (currentUser.id_rol === 2) return <NavClienteConSesion />;
    return <NavClienteSinSesion />;
  };

  const renderMainRoute = () => {
    if (!currentUser) return <ProductoVista />;
    if (currentUser.id_rol === 1) return <Productos />;
    if (currentUser.id_rol === 2) return <ProductosCliente />;
    return <ProductoVista />;
  };

  return (
    <Router>
      <div>
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <img
              src="https://i.pinimg.com/736x/14/f3/63/14f3635a9f6137cc99d441417ea8054b.jpg"
              alt="Logo"
              style={styles.logo}
            />
            <h1 style={styles.title}>Panadería de Chooper</h1>
          </div>
          {renderNav()}
        </header>
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={renderMainRoute()} />
            <Route path="/agregar" element={<Agregar />} />
            <Route path="/actualizar" element={<Actualizar />} />
            <Route path="/temporada" element={<Temporada />} />
            <Route path="/acceder" element={<Acceder />} />
            <Route path="/users" element={<Usuarios />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/historial" element={<HistorialCompras />} />
            <Route path="/historial/:id_usuario" element={<Historial />} />
            <Route path="/ticket" element={<Ticket />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;

const styles = {
  header: {
    padding: '20px',
    backgroundColor: '#1f3544',
    color: 'white',
    borderBottom: '5px solid #16254e',
    backgroundImage: 'url("https://i.pinimg.com/736x/1a/19/49/1a1949c547163994b7d8a1d11b2c0d1e.jpg")',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  logo: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '2px solid white',
  },
  title: {
    fontFamily: 'Merryweather, sans-serif',
    fontSize: '2.5rem',
    textShadow: '2px 2px 5px rgba(0,0,0,0.5)',
  },
  nav: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    padding: '10px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '8px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  main: {
    padding: '20px',
    minHeight: '100vh',
    backgroundImage: 'url("https://i.pinimg.com/736x/1e/72/f3/1e72f3f013f0b0d4662474abe04e88cf.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    color: '#ffffff',
  },
};
