import React, { useState } from 'react';
import { Input, Button, Form, Typography, notification } from 'antd';

const { Title, Text } = Typography;

const Eliminar = () => {
    const [id_producto, setIdProducto] = useState('');

    const handleSubmit = async (values) => {
        const { id_producto } = values;

        try {
            const response = await fetch(`http://localhost:5000/api/eliminar/${id_producto}`, {
                method: 'DELETE',
            });

            const result = await response.json();
            if (response.ok) {
                notification.success({
                    message: 'Producto Eliminado',
                    description: 'El producto se eliminó con éxito.',
                });
                setIdProducto('');
            } else {
                notification.error({
                    message: 'Error',
                    description: `Error: ${result.message}`,
                });
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            notification.error({
                message: 'Error',
                description: 'Hubo un error al eliminar el producto.',
            });
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Eliminar Producto</Title>
            <Form onFinish={handleSubmit} layout="vertical">
                <Form.Item
                    label="ID del Producto"
                    name="id_producto"
                    rules={[{ required: true, message: 'Por favor ingrese el ID del producto!' }]}
                >
                    <Input
                        type="number"
                        placeholder="Ingrese el ID del producto"
                        value={id_producto}
                        onChange={(e) => setIdProducto(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Eliminar Producto
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Eliminar;
