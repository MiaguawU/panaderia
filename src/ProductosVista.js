import React, { useState, useEffect } from 'react';
import { ConfigProvider, Card, Typography, Button, Space, Modal, InputNumber } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import API_URL from './Config';

const { Title, Paragraph } = Typography;

const ProductosCliente = () => {
  const [productos, setProductos] = useState([]);
  const [carritoVisible, setCarritoVisible] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  const isAuthenticated = false;

  useEffect(() => {
    fetch(`${API_URL}/productos`)
      .then((response) => {
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.json();
      })
      .then((data) => setProductos(data))
      .catch((error) => {
        console.error('Error al obtener los productos:', error.message);
        alert('Hubo un problema al cargar los productos.');
      });
  }, []);

  const agregarAlCarrito = (producto) => {
    setProductoSeleccionado(producto);
    setCantidad(1);
    setCarritoVisible(true);
  };

  const cerrarModal = () => {
    setCarritoVisible(false);
    setProductoSeleccionado(null);
  };

  const calcularTotal = () => {
    if (!productoSeleccionado || !productoSeleccionado.precio) return 0;
    return productoSeleccionado.precio * cantidad;
  };

  return (
    <ConfigProvider>
      {/* Resto del JSX */}
    </ConfigProvider>
  );
};

export default ProductosCliente;
