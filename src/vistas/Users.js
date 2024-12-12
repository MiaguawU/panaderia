import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Space, Tooltip, InputNumber } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PUERTO from "../Config";

const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${PUERTO}/roles`);
      setRoles(response.data);
    } catch (error) {
      console.error("Error al obtener los roles:", error);
      message.error("No se pudo obtener la lista de roles");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${PUERTO}/usuarios`);
      const usersWithRoleName = response.data.map((user) => {
        const role = roles.find((r) => r.id_rol === user.id_rol);
        return { ...user, rol_nombre: role ? role.nombre_rol : "Desconocido" };
      });
      setUsers(usersWithRoleName);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      message.error("No se pudo conectar con el servidor");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${PUERTO}/usuarios/${id}`);
      message.success("Usuario eliminado correctamente");
      fetchUsers();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      message.error("No se pudo eliminar el usuario");
    }
  };

  const handleEditUser = (user) => {
    setIsEditing(true);
    setCurrentUserId(user.id_usuario);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (roles.length > 0) {
      fetchUsers();
    }
  }, [roles]);

  const columns = [
    {
      title: "Foto",
      dataIndex: "imagen",
      key: "foto",
      render: (foto) => (
        <img
          src={foto || "https://via.placeholder.com/50"}
          alt="Foto de perfil"
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ),
    },
    {
      title: "Nombre",
      dataIndex: "nombre_usuario",
      key: "name",
    },
    {
      title: "Correo Electrónico",
      dataIndex: "correo",
      key: "email",
    },
    {
      title: "Rol",
      dataIndex: "rol_nombre",
      key: "role",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Editar">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteUser(record.id_usuario)}
            />
        
            
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button type="primary" onClick={() => navigate(`/historial/${record.id_usuario}`)}
            >
            Ver Historial
          </Button>
            </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setIsEditing(false);
          setIsModalVisible(true);
          form.resetFields();
        }}
        style={{ marginBottom: 16 }}
      >
        Agregar Usuario
      </Button>
      <Table dataSource={users} columns={columns} rowKey="id_usuario" />
      <Modal
        title={isEditing ? "Editar Usuario" : "Agregar Usuario"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              if (isEditing) {
                axios.put(`${PUERTO}/usuarios/${currentUserId}`, values).then(() => {
                  message.success("Usuario actualizado correctamente");
                  fetchUsers();
                  setIsModalVisible(false);
                });
              } else {
                axios.post(`${PUERTO}/usuarios`, values).then(() => {
                  message.success("Usuario agregado correctamente");
                  fetchUsers();
                  setIsModalVisible(false);
                });
              }
            })
            .catch((error) => console.error("Validación fallida:", error));
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nombre_usuario"
            label="Nombre"
            rules={[
              { required: true, message: "Por favor ingrese el nombre" },
              { max: 50, message: "El nombre no puede superar los 50 caracteres" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="correo"
            label="Correo Electrónico"
            rules={[
              { type: "email", message: "Ingrese un correo válido" },
              { max: 100, message: "El correo no puede superar los 100 caracteres" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contrasena"
            label="Contraseña"
            rules={[{ required: true, message: "Por favor ingrese la contraseña" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="imagen"
            label="URL de Imagen"
            rules={[{ required: true, message: "Por favor ingrese la URL de la imagen" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fondos"
            label="Fondos"
            rules={[
              { required: true, message: "Por favor ingrese los fondos iniciales" },
              {
                type: "number",
                min: 0,
                max: 999999999999,
                message: "El valor debe estar entre 0 y 999,999,999,999",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="id_rol"
            label="Rol"
            rules={[{ required: true, message: "Por favor seleccione un rol" }]}
          >
            <Select placeholder="Seleccione un rol">
              {roles.map((role) => (
                <Option key={role.id_rol} value={role.id_rol}>
                  {role.nombre_rol}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
