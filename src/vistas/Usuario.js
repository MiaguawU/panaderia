import React, { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Button, Divider, ConfigProvider, message } from 'antd';
import { EditOutlined, LogoutOutlined } from '@ant-design/icons';
import ModalEditProfile from './editarPerfil';
import axios from 'axios';
import PUERTO from '../Config';

const { Title, Text } = Typography;

const UserProfile = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    setLoading(true);
    try {
      const currentUserId = localStorage.getItem("currentUser");
      if (!currentUserId) {
        message.warning("No hay un usuario logueado actualmente.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${PUERTO}/cliente/${currentUserId}`, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data && response.data.rows && response.data.rows.length > 0) {
        const userData = response.data.rows[0]; // Accede al primer objeto en 'rows'
        setCurrentUser({
          id: userData.id_usuario,
          username: userData.nombre_usuario || "Nombre de Usuario",
          email: userData.correo || " ",
          foto_perfil: userData.imagen?.startsWith("http")
            ? userData.imagen
            : `${PUERTO}/${userData.imagen}`,
          fondos: userData.fondos || 0.00,
          password: userData.contrasena || 'pollo',
        });
        message.success("Datos del usuario obtenidos correctamente.");
      } else {
        message.warning("No se encontró información del usuario.");
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      message.error("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      await axios.put(`${PUERTO}/cliente/${currentUser.id}`, updatedData);
      setCurrentUser({ ...currentUser, ...updatedData });
      message.success("Perfil actualizado correctamente.");
      setModalVisible(false);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      message.error(
        error.response?.data?.message || "Error al actualizar el perfil. Intente nuevamente."
      );
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");

      await axios.post(`${PUERTO}/logout`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      sessionStorage.clear();
      localStorage.clear();
      message.success("Sesión cerrada correctamente.");
      window.location.href = '/acceder';
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      message.error("Error al cerrar sesión. Intente nuevamente.");
    }
  };

  if (loading) {
    return <div>Cargando datos del usuario...</div>;
  }

  const {
    username = "Nombre de Usuario",
    email = "usuario@example.com",
    foto_perfil = "https://via.placeholder.com/150",
    fondos = 0.00,
  } = currentUser || {};

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#3E7E1E',
          borderRadius: 10,
          colorBgContainer: '#F9F9F9',
          colorBorder: '#D3D3D3',
        },
      }}
    >
      <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
        <Card
          style={{
            backgroundColor: '#FFF8DC',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <Avatar
              size={100}
              src={foto_perfil}
              style={{
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                marginBottom: '16px',
              }}
            />
            <Title level={3} style={{ color: '#3E7E1E' }}>
              {username}
            </Title>
            <Text type="secondary">{email}</Text>
          </div>

          <Divider />

          <div style={{ marginBottom: '16px' }}>
            <Text strong>Fondos:</Text>
            <Text style={{ marginLeft: '8px' }}>
              {Number.isFinite(Number(fondos)) ? Number(fondos).toFixed(2) : '0.00'}
            </Text>
          </div>

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              style={{
                backgroundColor: '#669144',
                borderColor: '#669144',
                borderRadius: '8px',
              }}
              onClick={() => setModalVisible(true)}
            >
              Editar Perfil
            </Button>
            <Button
              danger
              icon={<LogoutOutlined />}
              style={{
                borderRadius: '8px',
              }}
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </div>
        </Card>

        <ModalEditProfile
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          user={currentUser}
          onUpdate={handleUpdate}
        />
      </div>
    </ConfigProvider>
  );
};

export default UserProfile;
