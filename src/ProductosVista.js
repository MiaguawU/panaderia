import React, { useState, useEffect } from 'react';
import { ConfigProvider, Card, Typography, Button, Space, Modal, InputNumber } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import PUERTO from './Config';

const { Title, Paragraph } = Typography;

const ProductosCliente = () => {
  const [productos, setProductos] = useState([]);
  const [carritoVisible, setCarritoVisible] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  // Simula si el usuario está autenticado
  const isAuthenticated = false; // Cambia a `true` para simular un usuario autenticado

  useEffect(() => {
    fetch(`${PUERTO}/productos`)
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error('Error al obtener los productos:', error));
  }, []);

  const agregarAlCarrito = (producto) => {
    setProductoSeleccionado(producto);
    setCantidad(1); // Restablece la cantidad por defecto
    setCarritoVisible(true);
  };

  const cerrarModal = () => {
    setCarritoVisible(false);
    setProductoSeleccionado(null);
  };

  const calcularTotal = () => {
    if (!productoSeleccionado) return 0;
    return productoSeleccionado.precio * cantidad;
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgBase: '#f5f5f5',
          colorPrimary: '#1890ff',
        },
      }}
    >
      <div
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Title
          level={1}
          style={{
            color: '#ffffff',
            marginBottom: '40px',
          }}
        >
          Productos
        </Title>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center',
          }}
        >
          {productos.map((producto) => (
            <Card
              key={producto.id_producto}
              hoverable
              style={{
                width: 300,
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
              cover={
                producto.imagen_url ? (
                  <img
                    src={producto.imagen_url}
                    alt={producto.nombre_producto}
                    style={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                      borderTopLeftRadius: '8px',
                      borderTopRightRadius: '8px',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: 200,
                      background: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#aaa',
                    }}
                  >
                    Sin imagen
                  </div>
                )
              }
            >
              <Title level={4} style={{ marginBottom: '8px', color: '#333' }}>
                {producto.nombre_producto}
              </Title>
              <Paragraph style={{ marginBottom: '8px', color: '#555' }}>
                {producto.descripcion}
              </Paragraph>
              <Paragraph style={{ marginBottom: '8px', color: '#333', fontWeight: 'bold' }}>
                Precio: ${producto.precio}
              </Paragraph>
              <Paragraph style={{ marginBottom: '8px', color: '#333', fontWeight: 'bold' }}>
                Piezas disponibles: {producto.piezas}
              </Paragraph>
              <Paragraph style={{ marginBottom: '16px', color: '#333' }}>
                Temporada: <strong>{producto.temporada}</strong>
              </Paragraph>
              <Space>
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  disabled={!isAuthenticated}
                  onClick={() => agregarAlCarrito(producto)}
                >
                  {isAuthenticated ? 'Agregar al Carrito' : 'Inicia sesión primero'}
                </Button>
              </Space>
            </Card>
          ))}
        </div>

        {/* Modal para el carrito */}
        <Modal
          title="Producto Agregado al Carrito"
          visible={carritoVisible}
          onCancel={cerrarModal}
          footer={[
            <Button key="close" onClick={cerrarModal}>
              Cerrar
            </Button>,
          ]}
        >
          {productoSeleccionado && (
            <>
              <Title level={4}>{productoSeleccionado.nombre_producto}</Title>
              <Paragraph>
                <strong>Precio Unitario:</strong> ${productoSeleccionado.precio.toFixed(2)}
              </Paragraph>
              <Paragraph>
                <strong>Cantidad:</strong>
                <InputNumber
                  min={1}
                  max={productoSeleccionado.piezas}
                  value={cantidad}
                  onChange={(value) => setCantidad(value)}
                  style={{ marginLeft: '10px' }}
                />
              </Paragraph>
              <Paragraph>
                <strong>Total:</strong> ${calcularTotal().toFixed(2)}
              </Paragraph>
            </>
          )}
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default ProductosCliente;
