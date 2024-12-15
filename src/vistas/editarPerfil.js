import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import axios from "axios";
import PUERTO from "../Config";

const ModalEditProfile = ({ visible, onClose, user, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const { username = "", email = "", foto_perfil = "", fondos = 0 } = user || {};

  const handleFinish = async (values) => {
    try {
      setLoading(true);

      // Obtener el ID del usuario actual
      const currentUserId = localStorage.getItem("currentUser");
      if (!currentUserId) {
        message.warning("No hay un usuario logueado actualmente.");
        return;
      }

      // Preparar los datos para la solicitud
      const { password, fondos, ...userData } = values;
      if (password) {
        userData.password = password; // Solo enviar contraseña si fue ingresada
      }
      userData.fondos = Number(fondos); // Asegurar que los fondos sean numéricos

      // Enviar la solicitud al backend
      const response = await axios.put(`${PUERTO}/cliente/${currentUserId}`, userData);

      message.success("Perfil actualizado correctamente");
      onUpdate(response.data); // Notifica al componente padre del cambio
      onClose(); // Cerrar el modal
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      message.error(
        error.response?.data?.message || "Error al actualizar el perfil."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Restablecer los valores del formulario al cerrar
  };

  return (
    <Modal
      title="Editar Perfil"
      visible={visible}
      onCancel={handleClose}
      footer={null}
      centered
    >
      <Form
        layout="vertical"
        initialValues={{ username, email, foto_perfil, fondos }}
        onFinish={handleFinish}
        onReset={handleClose}
      >
        <Form.Item
          label="Nombre de Usuario"
          name="username"
          rules={[{ required: true, message: "Por favor, ingresa tu nombre de usuario" }]}
        >
          <Input placeholder="Nombre de Usuario" />
        </Form.Item>

        <Form.Item
          label="Correo Electrónico"
          name="email"
        >
          <Input placeholder="Correo Electrónico" />
        </Form.Item>

        <Form.Item
          label="URL de Imagen de Perfil"
          name="foto_perfil"
          rules={[{ type: "url", message: "Por favor, ingresa una URL válida" }]}
        >
          <Input placeholder="URL de Imagen de Perfil" />
        </Form.Item>

        <Form.Item
          label="Fondos"
          name="fondos"
          rules={[
            { required: true, message: "Por favor, ingresa tus fondos actuales" },
          ]}
        >
          <Input type="number" placeholder="Fondos" min={0} />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="password"
          rules={[
            { min: 6, message: "La contraseña debe tener al menos 6 caracteres" },
          ]}
        >
          <Input.Password placeholder="Contraseña" autoComplete="new-password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Guardar Cambios
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEditProfile;
