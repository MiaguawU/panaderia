import React from 'react';
import { Modal, Typography, List } from 'antd';

const { Title, Paragraph } = Typography;

const ModalCarrito = ({ visible, onClose, producto, cantidad }) => {
  if (!producto) return null; // No renderiza nada si no hay producto seleccionado

  const total = producto.precio * cantidad;

  return (
    <Modal
      title="Producto Agregado al Carrito"
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Title level={4}>{producto.nombre_producto}</Title>
      <List>
        <List.Item>
          <Paragraph>
            <strong>Precio Unitario:</strong> ${producto.precio.toFixed(2)}
          </Paragraph>
        </List.Item>
        <List.Item>
          <Paragraph>
            <strong>Cantidad:</strong> {cantidad}
          </Paragraph>
        </List.Item>
        <List.Item>
          <Paragraph>
            <strong>Total:</strong> ${total.toFixed(2)}
          </Paragraph>
        </List.Item>
      </List>
    </Modal>
  );
};

export default ModalCarrito;
