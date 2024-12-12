import React, { useEffect, useState } from 'react';
import { List, Typography, Card, message, Divider } from 'antd';
import axios from 'axios';
import PUERTO from "../Config";

const { Title } = Typography;

const HistorialCompras = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerHistorialCompras = async () => {
    const currentUserId = localStorage.getItem('currentUser');
    if (!currentUserId) {
      message.warning('No hay un usuario logueado actualmente.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${PUERTO}/compras/${currentUserId}`, {
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
    obtenerHistorialCompras();
  }, []);

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
         Historial de Compras 
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
