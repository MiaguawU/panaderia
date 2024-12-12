const express = require("express");
const router = express.Router();
const db = require('./connection');

router.post("/", (req, res) => {
  if (req.session) {
    // Destruir la sesión
    req.session.destroy((err) => {
      if (err) {
        console.error("Error al destruir la sesión:", err);
        return res.status(500).json({ message: "No se pudo cerrar la sesión" });
      }

      res.status(200).json({ message: "Sesión cerrada correctamente" });
      console.error("sesion cerrada");
    });
  } else {
    res.status(400).json({ message: "No hay sesión activa" });
    console.error("no hay sesion activa");
  }
});

module.exports = router;
