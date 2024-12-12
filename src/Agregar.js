import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  notification,
  Typography,
} from 'antd';
import PUERTO from "./Config";

const { Title } = Typography;
const { Option } = Select;


const AgregarModal = ({ isVisible, onClose, onProductoAgregado }) => {
  const [formData, setFormData] = useState({
    nombre_producto: '',
    precio: '',
    descripcion: '',
    piezas: '',
    imagen_url: '',
    id_temporada: '',
  });

  const [temporadas, setTemporadas] = useState([]);

  useEffect(() => {
    fetch(`${PUERTO}/temporada`)
      .then((response) => response.json())
      .then((data) => setTemporadas(data))
      .catch((error) => console.error('Error al obtener las temporadas:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, id_temporada: value });
  };

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(`${PUERTO}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      if (response.ok) {
        notification.success({
          message: 'Producto Agregado',
          description: 'El producto se agregó con éxito.',
        });
        onProductoAgregado(); // Notificar al componente padre para que actualice la lista
        setFormData({
          nombre_producto: '',
          precio: '',
          descripcion: '',
          piezas: '',
          imagen_url: '',
          id_temporada: '',
        });
        onClose(); // Cerrar el modal
      } else {
        notification.error({
          message: 'Error',
          description: result.message || 'Hubo un error al agregar el producto.',
        });
      }
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      notification.error({
        message: 'Error',
        description: 'Hubo un error al agregar el producto.',
      });
    }
  };

  return (
    <Modal
      title="Agregar Producto"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={formData}
      >
        <Form.Item
          label="Nombre del Producto"
          name="nombre_producto"
          rules={[{ required: true, message: 'Por favor ingrese el nombre del producto!' }]}
        >
          <Input
            placeholder="Nombre del producto"
            value={formData.nombre_producto}
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item
          label="Precio"
          name="precio"
          rules={[{ required: true, message: 'Por favor ingrese el precio del producto!' }]}
        >
          <InputNumber
            min={0}
            step={0.01}
            placeholder="Precio"
            value={formData.precio}
            onChange={(value) => setFormData({ ...formData, precio: value })}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="Descripción"
          name="descripcion"
          rules={[{ required: true, message: 'Por favor ingrese una descripción!' }]}
        >
          <Input.TextArea
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item
          label="Piezas Disponibles"
          name="piezas"
          rules={[{ required: true, message: 'Por favor ingrese la cantidad de piezas!' }]}
        >
          <InputNumber
            min={0}
            placeholder="Piezas"
            value={formData.piezas}
            onChange={(value) => setFormData({ ...formData, piezas: value })}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="URL de la Imagen"
          name="imagen_url"
        >
          <Input
            placeholder="URL de la imagen"
            value={formData.imagen_url}
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item
          label="Temporada"
          name="id_temporada"
          rules={[{ required: true, message: 'Por favor seleccione una temporada!' }]}
        >
          <Select
            placeholder="Seleccione una temporada"
            onChange={handleSelectChange}
            value={formData.id_temporada}
          >
            {temporadas.map((temporada) => (
              <Option key={temporada.id_temporada} value={temporada.id_temporada}>
                {temporada.temporada}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Agregar Producto
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AgregarModal;
