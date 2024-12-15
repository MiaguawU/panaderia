// ChristmasAuth.js
import React, { useState } from "react";
import { Button, Form, Input, Tabs, Typography, message } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import API_URL from '../Config';
import axios from "axios";
import "./estilos/Acceder.css";

const { TabPane } = Tabs;
const { Title } = Typography;

const ChristmasAuth = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  // Funciones auxiliares para manejo de almacenamiento
  const setSessionData = (key, value) => {
    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, stringValue);
    sessionStorage.setItem(key, stringValue);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleRegister = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/cliente`, values);
      if (response.data?.id) {
        setSessionData("user", response.data);
        message.success("Registro exitoso");
      } else {
        throw new Error("Respuesta inesperada del servidor.");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      message.error(
        error.response?.data?.message || "Error al registrar. Intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/login`, values);
      if (response.data?.id) {
        const { id, username, foto_perfil } = response.data;
        const usuarios = JSON.parse(localStorage.getItem("usuarios") || "{}");
        usuarios[id] = { username, foto_perfil };

        setSessionData("usuarios", usuarios);
        setSessionData("currentUser", id);

        message.success(`Bienvenido, ${username}`);
        onLogin({ id, username, foto_perfil });

        window.location.reload();
      } else {
        throw new Error("Respuesta inesperada del servidor.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      message.error(
        error.response?.data?.message || "Error al iniciar sesión. Intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const commonStyles = {
    button: {
      marginTop: 15,
      backgroundColor: "#fff",
      border: "1px solid #000",
    },
    formButton: {
      block: true,
      size: "large",
      loading,
    },
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Title level={2} style={{ color: "#fff" }}>
          ¡Feliz Navidad!
        </Title>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Iniciar Sesión" key="1">
            <Form
              name="login"
              onFinish={handleLogin}
              layout="vertical"
              style={{ marginTop: 20 }}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: "Por favor, ingresa tu usuario" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Usuario"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Por favor, ingresa tu contraseña" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Contraseña"
                  size="large"
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: "#FF5733",
                  borderColor: "#FF5733",
                }}
                {...commonStyles.formButton}
              >
                Iniciar Sesión
              </Button>
            </Form>
            <Button
              shape="circle"
              icon={<GoogleOutlined style={{ color: "#000" }} />}
              size="large"
              onClick={handleGoogleLogin}
              style={commonStyles.button}
            />
          </TabPane>
          <TabPane tab="Registrarse" key="2">
            <Form
              name="register"
              onFinish={handleRegister}
              layout="vertical"
              style={{ marginTop: 20 }}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: "Por favor, ingresa un usuario" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Usuario"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Por favor, ingresa una contraseña" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Contraseña"
                  size="large"
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: "#28A745",
                  borderColor: "#28A745",
                }}
                {...commonStyles.formButton}
              >
                Registrarse
              </Button>
            </Form>
            <Button
              shape="circle"
              icon={<GoogleOutlined style={{ color: "#000" }} />}
              size="large"
              onClick={handleGoogleLogin}
              style={commonStyles.button}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ChristmasAuth;
