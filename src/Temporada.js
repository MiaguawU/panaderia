import React, { useState, useEffect } from 'react';
import { Table, Typography, Space, notification } from 'antd';
import PUERTO from './Config';

const { Title } = Typography;

const Temporadas = () => {
    const [temporadas, setTemporadas] = useState([]);

    useEffect(() => {
        fetch(`${PUERTO}/temporadas`)
            .then((response) => response.json())
            .then((data) => setTemporadas(data))
            .catch((error) => {
                console.error('Error al obtener las temporadas:', error);
                notification.error({
                    message: 'Error',
                    description: 'Hubo un error al obtener las temporadas.',
                });
            });
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id_temporada',
            key: 'id_temporada',
            sorter: (a, b) => a.id_temporada - b.id_temporada,
        },
        {
            title: 'Temporada',
            dataIndex: 'temporada',
            key: 'temporada',
        },
        {
            title: 'Fecha de Inicio',
            dataIndex: 'fecha_inicio',
            key: 'fecha_inicio',
            render: (text) => <span>{new Date(text).toLocaleDateString()}</span>,
        },
        {
            title: 'Fecha de Término',
            dataIndex: 'fecha_termino',
            key: 'fecha_termino',
            render: (text) => <span>{new Date(text).toLocaleDateString()}</span>,
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Temporadas</Title>
            <Table
                columns={columns}
                dataSource={temporadas}
                rowKey="id_temporada"
                pagination={true}
                bordered
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
};

export default Temporadas;
