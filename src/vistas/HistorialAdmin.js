import React, { useEffect, useState } from 'react';
import { List, Typography, Card, message, Divider } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PUERTO from "../Config";

const { Title } = Typography;

const HistorialCompras = () => {
  const { id_usuario } = useParams(); // Asegúrate de que useParams esté correctamente importado
  const [nombreUsuario, setNombreUsuario] = useState(' ');
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerNombreUsuario = async () => {
    if (!id_usuario) {
      message.warning('El ID de usuario no está especificado en la URL.');
      return;
    }
  
    try {
      console.log(`Solicitando datos del usuario con ID: ${id_usuario}`);
      const response = await axios.get(`${PUERTO}/cliente/${id_usuario}`, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      // Si el endpoint devuelve un arreglo
      const usuarios = response.data;
  
      if (usuarios?.length) {
        // Usamos .map para procesar la respuesta (aunque solo necesitamos el primer usuario en este caso)
        usuarios.map((usuario) => {
          setNombreUsuario(usuario.nombre_usuario); // Extraemos el nombre del usuario
          return usuario; // Retornamos el usuario por completitud
        });
        message.success('Usuario obtenido correctamente.');
      } else {
        message.warning('No se encontró información del usuario.');
      }
    } catch (error) {
      console.error('Error al obtener el nombre del usuario:', error);
      message.error('No se pudo conectar con el servidor para obtener el nombre del usuario.');
    }
  };
  
  

  const obtenerHistorialCompras = async () => {
    if (!id_usuario) {
      message.warning('El ID de usuario no está especificado en la URL.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${PUERTO}/compras/${id_usuario}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data?.length) {
        setHistorial(
          response.data.map((item) => ({
            id: item.numero,
            producto: item.nombre || 'Producto no especificado',
            fecha: new Intl.DateTimeFormat('en-CA', { dateStyle: 'short' }).format(new Date(item.fecha)),
            total: item.total,
            totalUnidad: item.total_u,
            precioUnitario: item.precio,
          }))
        );
      } else {
        message.warning('No hay historial de compras para este usuario.');
      }
    } catch (error) {
      console.error('Error al obtener el historial de compras:', error);
      message.error('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerNombreUsuario();
    obtenerHistorialCompras();
  }, [id_usuario]); // Asegúrate de que se ejecute cada vez que id_usuario cambie

  return (
    <div
      style={{
        background: 'url("https://i.pinimg.com/originals/9e/4b/6f/9e4b6f83f87214b28c47c4a768d91fc2.jpg")',
        backgroundSize: 'cover',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <Title level={2} style={{ color: '#FFFAF0', textAlign: 'center', marginBottom: '30px' }}>
  {`Historial de ${nombreUsuario ? `de ${nombreUsuario}` : ''}`}
</Title>

      <List
        loading={loading}
        dataSource={historial}
        renderItem={(item) => (
          <Card
            key={item.id}
            style={{
              marginBottom: '20px',
              borderRadius: '15px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              background: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <p><strong style={{ color: '#2F4F4F' }}>Número de Venta:</strong> {item.id}</p>
            <p><strong style={{ color: '#2F4F4F' }}>Producto:</strong> {item.producto}</p>
            <p><strong style={{ color: '#2F4F4F' }}>Fecha:</strong> {item.fecha}</p>
            <Divider style={{ borderColor: '#8B0000' }} />
            <p><strong style={{ color: '#8B0000' }}>Total por Unidad:</strong> ${item.totalUnidad}</p>
            <p><strong style={{ color: '#8B0000' }}>Precio Unitario:</strong> ${item.precioUnitario}</p>
            <Divider style={{ borderColor: '#2F4F4F' }} />
            <p><strong style={{ color: '#2F4F4F' }}>Total Compra:</strong> ${item.total}</p>
          </Card>
        )}
      />
    </div>
  );
};

export default HistorialCompras;
