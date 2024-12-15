const express = require('express');
const db = require('./connection'); // Asegúrate de que la conexión esté configurada correctamente.

const router = express.Router();

// Middleware para analizar cuerpos de solicitudes con datos en formato JSON
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Ruta para inicio de sesión
router.post('/', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Faltan datos requeridos: username y password" });
  }

  // Validar el usuario directamente en la base de datos
  const query = `
    SELECT id_usuario, nombre_usuario, imagen, fondos, id_rol
    FROM Usuarios
    WHERE nombre_usuario = $1 AND contrasena = $2
  `;
  const values = [username, password];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al realizar la consulta:", err);
      return res.status(500).json({ error: 'Error al realizar la consulta' });
    }

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id_usuario,
      username: user.nombre_usuario,
      imagen: user.imagen,
      fondos: user.fondos,
      id_rol: user.id_rol,
      message: "Sesión iniciada con éxito",
    });
  });
});

module.exports = router;
