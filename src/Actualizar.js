import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  notification,
} from 'antd';
import axios from 'axios';
import PUERTO from './Config';

const { Option } = Select;

const ActualizarModal = ({ isVisible, onClose, onProductoActualizado, id_producto }) => {
  const [form] = Form.useForm(); // Crear una instancia del formulario
  const [temporadas, setTemporadas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar temporadas desde la API
  const fetchTemporadas = async () => {
    try {
      const response = await axios.get(`${PUERTO}/temporada`);
      setTemporadas(response.data);
    } catch (error) {
      console.error('Error al cargar las temporadas:', error);
      notification.error({
        message: 'Error',
        description: 'No se pudieron cargar las temporadas.',
      });
    }
  };

  // Cargar datos del producto seleccionado
  const fetchProducto = async () => {
    if (!id_producto) return;

    setLoading(true);
    try {
      const response = await axios.get(`${PUERTO}/productos/${id_producto}`);
      if (response.data && response.data.length > 0) {
        const producto = response.data[0]; // Se espera un único resultado
        form.setFieldsValue(producto); // Establecer valores del formulario
      } else {
        notification.warning({
          message: 'Producto no encontrado',
          description: 'No se encontró información para este producto.',
        });
      }
    } catch (error) {
      console.error('Error al cargar los datos del producto:', error);
      notification.error({
        message: 'Error',
        description: 'No se pudieron cargar los datos del producto.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchTemporadas();
      fetchProducto();
    }
  }, [isVisible]);

  const handleSubmit = async (values) => {
    try {
      const response = await axios.put(`${PUERTO}/productos/${id_producto}`, values);
      if (response.status === 200) {
        notification.success({
          message: 'Producto Actualizado',
          description: 'El producto se actualizó con éxito.',
        });
        onProductoActualizado();
        onClose();
      } else {
        notification.error({
          message: 'Error',
          description: 'No se pudo actualizar el producto.',
        });
      }
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      notification.error({
        message: 'Error',
        description: 'Hubo un error al actualizar el producto.',
      });
    }
  };

  return (
    <Modal
      title="Actualizar Producto"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form
        form={form} // Vincular el formulario con la instancia creada
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          label="Nombre del Producto"
          name="nombre_producto"
          rules={[{ required: true, message: 'Por favor ingrese el nombre del producto.' }]}
        >
          <Input placeholder="Nombre del producto" />
        </Form.Item>

        <Form.Item
          label="Precio"
          name="precio"
          rules={[{ required: true, message: 'Por favor ingrese el precio.' }]}
        >
          <InputNumber min={0} step={0.01} placeholder="Precio" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Descripción"
          name="descripcion"
          rules={[{ required: true, message: 'Por favor ingrese una descripción.' }]}
        >
          <Input.TextArea placeholder="Descripción" />
        </Form.Item>

        <Form.Item
          label="Piezas Disponibles"
          name="piezas"
          rules={[{ required: true, message: 'Por favor ingrese la cantidad de piezas disponibles.' }]}
        >
          <InputNumber min={0} placeholder="Piezas" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="URL de la Imagen"
          name="imagen_url"
          rules={[{ type: 'url', message: 'Por favor ingrese una URL válida.' }]}
        >
          <Input placeholder="URL de la imagen" />
        </Form.Item>

        <Form.Item
          label="Temporada"
          name="id_temporada"
          rules={[{ required: true, message: 'Por favor seleccione una temporada.' }]}
        >
          <Select placeholder="Seleccione una temporada">
            {temporadas.map((temporada) => (
              <Option key={temporada.id_temporada} value={temporada.id_temporada}>
                {temporada.temporada}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Actualizar Producto
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ActualizarModal;
