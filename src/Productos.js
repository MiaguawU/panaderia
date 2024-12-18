import React, { useState, useEffect } from 'react';
import {
  ConfigProvider,
  Card,
  Typography,
  Button,
  Space,
  Modal,
  InputNumber,
  Popconfirm,
  message
} from 'antd';
import { ShoppingCartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import PUERTO from './Config';
import AgregarModal from './Agregar';
import ActualizarModal from './Actualizar';

const { Title, Paragraph } = Typography;

const ProductosConEditarEliminar = () => {
  const [productos, setProductos] = useState([]);
  const [carritoVisible, setCarritoVisible] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [isAgregarVisible, setAgregarVisible] = useState(false);
  const [isActualizarVisible, setActualizarVisible] = useState(false);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch(`${PUERTO}/productos`);
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  const agregarAlCarrito = (producto) => {
    setProductoSeleccionado(producto);
    setCantidad(1);
    setCarritoVisible(true);
  };

  const cerrarModal = () => {
    setCarritoVisible(false);
    setProductoSeleccionado(null);
  };

  const abrirModalActualizar = (producto) => {
    setProductoSeleccionado(producto.id_producto);
    setActualizarVisible(true);
  };

  const eliminarProducto = async (id_producto) => {
    try {
      const response = await fetch(`${PUERTO}/productos/${id_producto}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        message.success('Producto eliminado con éxito');
        fetchProductos();
      } else {
        message.error('Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      message.error('Error al eliminar el producto');
    }
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
          backgroundImage: 'url("https://i.imgur.com/your-background-image.jpg")',
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
        <Space style={{ marginBottom: '20px' }}>
          <Button type="primary" onClick={() => setAgregarVisible(true)}>
            Agregar Producto
          </Button>
        </Space>
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
              actions={[
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => abrirModalActualizar(producto)}
                >
                  Editar
                </Button>,
                <Popconfirm
                  title="¿Estás seguro de eliminar este producto?"
                  onConfirm={() => eliminarProducto(producto.id_producto)}
                  okText="Sí"
                  cancelText="No"
                >
                  <Button type="text" danger icon={<DeleteOutlined />}>
                    Eliminar
                  </Button>
                </Popconfirm>,
              ]}
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
            </Card>
          ))}
        </div>

        <AgregarModal
          isVisible={isAgregarVisible}
          onClose={() => setAgregarVisible(false)}
          onProductoAgregado={fetchProductos}
        />

<ActualizarModal
  isVisible={isActualizarVisible}
  onClose={() => setActualizarVisible(false)}
  onProductoActualizado={fetchProductos}
  id_producto={productoSeleccionado}
/>

      </div>
    </ConfigProvider>
  );
};

export default ProductosConEditarEliminar;
