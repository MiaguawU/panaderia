import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Select, notification, Typography } from 'antd';

const { Title } = Typography;
const { Option } = Select;

const Agregar = () => {
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
        fetch('http://localhost:5000/api/temporadas')
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
            const response = await fetch('http://localhost:5000/api/agregar', {
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
                setFormData({
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
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Agregar Producto</Title>
            <Form onFinish={handleSubmit} layout="vertical" initialValues={formData}>
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
        </div>
    );
};

export default Agregar;
