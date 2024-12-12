import React, { useState, useEffect } from 'react';
import { Typography, Card, List, Divider, message } from 'antd';
import axios from 'axios';
import PUERTO from '../Config';

const { Title, Text } = Typography;

const Ticket = () => {
  const [ticketInfo, setTicketInfo] = useState({
    id: null,
    fecha: '',
    productos: [],
    totalCompra: 0, // Aseguramos que sea un número
  });
  const [loading, setLoading] = useState(false);

  const obtenerHistorialCompras = async () => {
    const currentUserId = localStorage.getItem('currentUser');
    if (!currentUserId) {
      message.warning('No hay un usuario logueado actualmente.');
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.get(`${PUERTO}/compras/ultimo/${currentUserId}`, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      const data = response.data;
      if (data) {
        setTicketInfo({
          id: data.numero || 'No disponible',
          fecha: new Intl.DateTimeFormat('en-CA', { dateStyle: 'short' }).format(new Date(data.fecha)),
          productos: [
            {
              nombre: data.nombre || 'Producto no especificado',
              cantidad: data.cantidad || 0,
              precioUnitario: data.precio ? parseFloat(data.precio) : 0, // Asegura que sea un número
              total: data.total_u ? parseFloat(data.total_u) : 0, // Asegura que sea un número
            },
          ],
          totalCompra: data.total ? parseFloat(data.total) : 0, // Asegura que sea un número
        });
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
        padding: '20px',
        textAlign: 'center',
        minHeight: '100vh',
      }}
    >
      <Card
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundImage:
            'url("https://i.pinimg.com/736x/80/1d/0b/801d0b2cd77a56a27fcdc9bbfb47c21d.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '15px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          color: '#FFCCF0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
          <img
            src="https://i.pinimg.com/736x/14/f3/63/14f3635a9f6137cc99d441417ea8054b.jpg"
            alt="Logo de la Panadería"
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              marginRight: '10px',
            }}
          />
          <Title level={2} style={{ color: '#FFCCF0', marginBottom: 0 }}>
            Panadería de Chopper
          </Title>
        </div>
        <Text strong style={{ fontSize: '16px', color: '#FFCCF0' }}>
          Gracias por tu compra
        </Text>
        <Divider style={{ borderColor: '#FFCCF0' }} />
        <p
          style={{
            color: '#43B3BF',
            marginBottom: 0,
            fontWeight: 'bold',
            background: 'linear-gradient(transparent 70%, #FFCCF0 100%)',
            display: 'inline-block',
          }}
        >
          <strong>Número de venta:</strong> {ticketInfo.id}
        </p>
        <br />
        <p
          style={{
            color: '#43B3BF',
            marginBottom: 0,
            fontWeight: 'bold',
            background: 'linear-gradient(transparent 70%, #FFCCF0 100%)',
            display: 'inline-block',
          }}
        >
          <strong>Fecha:</strong> {ticketInfo.fecha}
        </p>
        <Divider style={{ borderColor: '#FFCCF0' }} />
        <Title level={4} style={{
            color: '#43B3BF',
            marginBottom: 0,
            fontWeight: 'bold',
            background: 'linear-gradient(transparent 70%, #FFCCF0 100%)',
            display: 'inline-block',
          }}>
          Productos
        </Title>
        <List
  dataSource={ticketInfo.productos}
  renderItem={(item) => (
    <List.Item>
      <div style={{ textAlign: 'left', width: '100%' }}>
        <Text strong style={{ color: '#FFCCF0' }}>{item.nombre}</Text>
        <p style={{ color: '#FFCCF0' }}>
          <strong>Cantidad:</strong> {item.cantidad} <br />
          <strong>Precio Unitario:</strong> $
          {typeof item.precioUnitario === 'number' ? item.precioUnitario.toFixed(2) : '0.00'} <br />
          <strong>Total:</strong> $
          {typeof item.total === 'number' ? item.total.toFixed(2) : '0.00'}
        </p>
      </div>
    </List.Item>
  )}
/>
        <Divider style={{ borderColor: '#FFCCF0' }} />
        <Text strong style={{ fontSize: '18px', color: '#FFCCF0' }}>
          Total de la compra: ${Number(ticketInfo.totalCompra).toFixed(2)}
        </Text>
      </Card>
    </div>
  );
};

export default Ticket;
