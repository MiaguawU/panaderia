const express = require('express');
const db = require('./connection'); // Asegúrate de configurar la conexión correctamente.

const router = express.Router();

// Middleware para analizar cuerpos de solicitudes con datos en formato JSON
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Ruta para inicio de sesión
router.post('/', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Faltan datos requeridos: username y password");
  }

  // Validar el usuario en la tabla Usuarios
  db.query('SELECT * FROM Usuarios WHERE nombre_usuario = ?', [username], (err, result) => {
    if (err) {
      console.error("Error al obtener el usuario:", err);
      return res.status(500).send('Error al obtener el usuario');
    }

    if (result.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }

    const user = result[0];

    // Validar la contraseña
    if (user.contrasena !== password) {
      return res.status(401).send('Contraseña incorrecta');
    }

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

// Ruta para listar productos según la temporada
router.get('/productos/:temporada', (req, res) => {
  const temporada = req.params.temporada;

  const query = `
    SELECT p.id_producto, p.nombre_producto, p.precio, p.descripcion, p.piezas, p.imagen_url, t.temporada
    FROM Producto p
    JOIN Temporada t ON p.id_temporada = t.id_temporada
    WHERE t.temporada = ?
  `;

  db.query(query, [temporada], (err, results) => {
    if (err) {
      console.error("Error al obtener los productos:", err);
      return res.status(500).send('Error al obtener los productos');
    }

    res.json(results);
  });
});

module.exports = router;
