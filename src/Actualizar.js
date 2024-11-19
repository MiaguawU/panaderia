import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, notification, Typography, Select } from 'antd';

const { Title } = Typography;
const { Option } = Select;

const Actualizar = () => {
    const [formData, setFormData] = useState({
        id_producto: '',
        nombre_producto: '',
        precio: '',
        descripcion: '',
        piezas: '',
        imagen_url: '',
        id_temporada: '',
    });

    const [temporadas, setTemporadas] = useState([]);

    // Cargar temporadas desde el servidor
    useEffect(() => {
        const fetchTemporadas = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/temporadas');
                const data = await response.json();
                setTemporadas(data);
            } catch (error) {
                console.error('Error al cargar las temporadas:', error);
                notification.error({
                    message: 'Error',
                    description: 'No se pudieron cargar las temporadas.',
                });
            }
        };

        fetchTemporadas();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (values) => {
        const { id_producto, ...updatedData } = values;

        try {
            const response = await fetch(`http://localhost:5000/api/actualizar/${id_producto}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            const result = await response.json();
            if (response.ok) {
                notification.success({
                    message: 'Producto Actualizado',
                    description: 'El producto se actualizó con éxito.',
                });
                setFormData({
                    id_producto: '',
                    nombre_producto: '',
                    precio: '',
                    descripcion: '',
                    piezas: '',
                    imagen_url: '',
                    id_temporada: '',
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: result.message || 'Hubo un error al actualizar el producto.',
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
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Actualizar Producto</Title>
            <Form onFinish={handleSubmit} layout="vertical" initialValues={formData}>
                <Form.Item
                    label="ID del Producto"
                    name="id_producto"
                    rules={[{ required: true, message: 'Por favor ingrese el ID del producto!' }]}
                >
                    <InputNumber
                        min={1}
                        placeholder="ID del producto"
                        value={formData.id_producto}
                        onChange={(value) => setFormData({ ...formData, id_producto: value })}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    label="Nombre del Producto"
                    name="nombre_producto"
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
                        value={formData.id_temporada}
                        onChange={(value) => setFormData({ ...formData, id_temporada: value })}
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
                        Actualizar Producto
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Actualizar;
