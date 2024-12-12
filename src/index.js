import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import axios from "axios";
import reportWebVitals from "./reportWebVitals";
import PUERTO from './Config';

// Funciones auxiliares para manejar almacenamiento
const setSessionData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  sessionStorage.setItem(key, JSON.stringify(value));
};

const getSessionData = (key) => {
  const sessionValue = sessionStorage.getItem(key);
  if (sessionValue) return JSON.parse(sessionValue);

  const localValue = localStorage.getItem(key);
  return localValue ? JSON.parse(localValue) : null;
};

// Extraer y procesar parámetros de la URL
const queryParams = new URLSearchParams(window.location.search);
const userData = {};

// Convertir parámetros de URL a un objeto
queryParams.forEach((value, key) => {
  userData[key] = decodeURIComponent(value);
});

// Procesar los datos de la URL
if (Object.keys(userData).length > 0) {
  (async () => {
    try {
      // Validar y limpiar el campo id
      if (userData.id) {
        userData.id = userData.id.trim(); // Elimina espacios innecesarios
      }

      const cleanedData = {
        ...userData,
        id: userData.id && userData.id.replace(/^"|"$/g, "") // Elimina comillas iniciales y finales
      };

      const response = await axios.post(`${PUERTO}/save`, cleanedData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Datos enviados al servidor:", response.data);

      const usuarios = getSessionData("usuarios") || {};
      const { id, username, email, imagen, fondos, message } = cleanedData;

      if (id) {
        usuarios[id] = { username, email, imagen, fondos, message };
        setSessionData("usuarios", usuarios);
        setSessionData("currentUser", id);
        console.log("Datos guardados en almacenamiento local.");
      } else {
        console.warn("ID de usuario no proporcionado o inválido.");
      }
    } catch (error) {
      console.error("Error al enviar los datos al servidor:", error);
    }
  })();
}

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
