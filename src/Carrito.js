import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  List,
  Typography,
  InputNumber,
  Divider,
  ConfigProvider,
  message,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import PUERTO from "./Config";

const { Title, Text } = Typography;

const Cart = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    obtenerDatos();
    obtenerFondos();
  }, []);

  const enviar = async () => {
    const currentUserId = localStorage.getItem("currentUser");
    if (!currentUserId) {
      message.warning("No hay un usuario logueado actualmente.");
      return;
    }
  
    try {
      const response = await axios.get(`${PUERTO}/carros/${currentUserId}`);
      const id_carrito = response.data[0]?.id_carrito;
  
      if (!id_carrito) {
        message.warning("No se encontró un carrito asociado al usuario.");
        return;
      }
  
      const datos = {
        id_carrito,
        id_usuario: currentUserId,
      };
  
      console.log("Datos enviados al backend:", datos); // Debug del frontend
  
      const compraResponse = await axios.post(`${PUERTO}/compras`, datos, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (compraResponse.status === 201) {
        message.success("Compra realizada con éxito.");
        setCartItems([]);
        setTotal(0);
      } else {
        message.warning("No se pudo completar la compra.");
      }
    } catch (error) {
      console.error("Error en el envío al backend:", error.response?.data || error.message);
  
      if (error.response?.status === 500) {
        message.error("Error interno del servidor al registrar la compra.");
      } else {
        message.error("No se pudo conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  
  const obtenerDatos = async () => {
    const currentUserId = localStorage.getItem("currentUser");
    if (!currentUserId) {
      message.warning("No hay un usuario logueado actualmente.");
      return;
    }

    try {
      const response = await axios.get(`${PUERTO}/carros/${currentUserId}`);
      const id_carrito = response.data[0]?.id_carrito;
      if (!id_carrito) {
        message.warning("No se encontró información del carrito.");
        return;
      }

      const response2 = await axios.get(`${PUERTO}/proCar/${id_carrito}`, {
        headers: { "Content-Type": "application/json" },
      });

      if (response2.data?.length) {
        setCartItems(
          response2.data.map((item) => ({
            id: item.id,
            name: item.producto || "Producto no especificado",
            price: item.precio || 0,
            quantity: item.cantidad || 1,
          }))
        );
      } else {
        message.warning("No hay productos en el carrito.");
      }
    } catch (error) {
      console.error("Error al obtener los datos del carrito:", error);
      message.error("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const obtenerFondos = async () => {
    try {
      const currentUserId = localStorage.getItem("currentUser");
      if (!currentUserId) {
        message.warning("No hay un usuario logueado actualmente.");
        return;
      }

      const response = await axios.get(`${PUERTO}/cliente/${currentUserId}`, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data?.length) {
        const userData = response.data[0];
        setCurrentUser({ fondos: userData.fondos || 0 });
      } else {
        message.warning("No se encontró información del usuario.");
      }
    } catch (error) {
      console.error("Error al obtener los fondos del usuario:", error);
      message.error("No se pudo conectar con el servidor.");
    }
  };

  const handleQuantityChange = (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = async (id) => {
    try {
      await axios.delete(`${PUERTO}/proCar/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      message.success("Producto eliminado del carrito.");
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      message.error("No se pudo conectar con el servidor.");
    }
  };

  useEffect(() => {
    const calcularTotal = () => {
      const totalCalculado = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotal(totalCalculado);
    };
    calcularTotal();
  }, [cartItems]);

  const fondos = currentUser?.fondos || 0;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#3E7E1E",
          borderRadius: 10,
          colorBgContainer: "#F9F9F9",
          colorBorder: "#D3D3D3",
        },
      }}
    >
      <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
        <Card
          style={{
            backgroundColor: "#FFF8DC",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Title level={2} style={{ textAlign: "center", color: "#3E7E1E" }}>
            🛒 Tu Carrito de Compras
          </Title>

          <List
            itemLayout="horizontal"
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <InputNumber
                    min={1}
                    value={item.quantity}
                    onChange={(value) => handleQuantityChange(item.id, value)}
                  />,
                  <Button
                    danger
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(item.id)}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={<Text strong>{item.name}</Text>}
                  description={`Precio: $${item.price}`}
                />
                <Text strong>Total: ${(item.price * item.quantity).toFixed(2)}</Text>
              </List.Item>
            )}
          />

          <Divider />

          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Text strong style={{ fontSize: "18px" }}>
              Total: ${total.toFixed(2)}
            </Text>
            {total > fondos && (
              <Text style={{ color: "red", display: "block", marginTop: "8px" }}>
                Fondos insuficientes.
              </Text>
            )}
          </div>

          <Button
            type="primary"
            block
            style={{
              marginTop: "16px",
              backgroundColor: "#3E7E1E",
              borderColor: "#3E7E1E",
              borderRadius: "8px",
            }}
            disabled={total > fondos}
            onClick={enviar}
          >
            Proceder al Pago
          </Button>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default Cart;
