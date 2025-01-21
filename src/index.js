import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import axios from "axios";
import reportWebVitals from "./reportWebVitals";
import PUERTO from "./Config";

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

// Obtener el usuario autenticado al cargar la aplicación
const fetchCurrentUser = async () => {
  try {
    const response = await axios.get(`${PUERTO}/auth/me`, {
      withCredentials: true, // Permite enviar cookies al servidor
    });

    if (response.data && response.data.user) {
      const { id, username, email, foto_perfil } = response.data.user;
      const usuarios = getSessionData("usuarios") || {};

      usuarios[id] = { username, email, foto_perfil };
      setSessionData("usuarios", usuarios);
      setSessionData("currentUser", id);

      console.log("Usuario autenticado cargado exitosamente.");
    } else {
      console.warn("No hay usuario autenticado.");
    }
  } catch (error) {
    console.error("Error al obtener el usuario autenticado:", error);
  }
};

// Llamar a esta función antes de renderizar la aplicación
fetchCurrentUser();

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
