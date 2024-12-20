import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import axios from "axios";
import PUERTO from "../Config";

const ModalEditProfile = ({ visible, onClose, user, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const { username = "", email = "", foto_perfil = "", fondos = 0 } = user || {};

  const handleFinish = async (values) => {
    try {
      const currentUserId = localStorage.getItem("currentUser");
      if (!currentUserId) {
        message.warning("No hay un usuario logueado actualmente.");
        setLoading(false);
        return;
      }
      setLoading(true);
      // Enviar solicitud al backend para actualizar el perfil
      const response = await axios.put(`${PUERTO}/cliente/${currentUserId}`, values);

      message.success("Perfil actualizado correctamente");
      onUpdate(response.data); // Notifica al componente padre del cambio
      onClose();
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      message.error(
        error.response?.data?.message || "Error al actualizar el perfil."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Editar Perfil"
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form
        layout="vertical"
        initialValues={{ username, email, foto_perfil, fondos }}
        onFinish={handleFinish}
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
          <Input  />
        </Form.Item>

        <Form.Item
          label="URL de Imagen de Perfil"
          name="foto_perfil"
          rules={[{ type: "url", message: "Por favor, ingresa una URL válida" }]}
        >
          <Input placeholder="URL de Imagen de Perfil" />
        </Form.Item>

        <Form.Item label="Fondos" name="fondos">
          <Input type="number" placeholder="Fondos" min={0} />
        </Form.Item>

        <Form.Item
        label="Contraseña"
        name="password"
        rules={[
            { required: true, message: "Por favor, ingresa una contraseña" },
            { min: 6, message: "La contraseña debe tener al menos 6 caracteres" },
        ]}
        >
        <Input.Password placeholder="Contraseña" autoComplete="current-password" />
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
