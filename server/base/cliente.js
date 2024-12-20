const express = require('express');
const db = require('./connection');
const router = express.Router();

// Middleware para manejar errores
const handleError = (res, message, error = null) => {
    console.error(message, error);
    res.status(500).send(message);
};

// Obtener todos los usuarios
router.get('/:id', (req, res) => {
    let { id } = req.params;
    id = id.replace(/^"|"$/g, ''); // Elimina comillas al inicio y al final

    console.log("ID limpio:", id);

    const sql = 'SELECT * FROM Usuarios WHERE id_usuario = $1';
    db.query(sql, [id], (err, results) => {
        if (err) return handleError(res, 'Error al obtener los usuarios.', err);
        res.json(results);
        console.log(results);
    });
});

// Agregar un nuevo usuario
router.post('/', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Faltan datos requeridos: username o password.');
    }

    // Consulta para insertar un usuario y devolver su id
    const sql = `
        INSERT INTO Usuarios (nombre_usuario, contrasena, id_rol, imagen, fondos)
        VALUES ($1, $2, 2, 'https://i.pinimg.com/736x/ea/55/a7/ea55a756b236f936d4e9f2b8c356bdaf.jpg', 0)
        RETURNING id_usuario
    `;

    // Consulta para insertar el carrito
    const sql2 = `
        INSERT INTO carritos (id_usuario)
        VALUES ($1)
    `;

    // Insertar el usuario
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error('Error al agregar el usuario:', err);
            return res.status(500).send('Error al agregar el usuario.');
        }

        // Obtener el id del usuario recién insertado
        const id_usuario = result.rows[0].id_usuario;

        // Insertar el carrito asociado al usuario
        db.query(sql2, [id_usuario], (err1) => {
            if (err1) {
                console.error('Error al agregar el carrito:', err1);
                return res.status(500).send('Error al agregar carrito.');
            }

            res.status(201).json({ id: id_usuario });
        });
    });
});


// Actualizar un usuario
router.put('/:id', (req, res) => {
    let { id } = req.params;
    id = parseInt(id.trim().replace(/['"]+/g, ''), 10);

    if (isNaN(id)) {
        return res.status(400).send('El ID debe ser un número válido.');
    }

    const { username, email, password, foto_perfil, fondos } = req.body;

    if (!username || !password || !foto_perfil || fondos == null) {
        return res.status(400).send('Faltan datos requeridos.');
    }

    const sql = `
        UPDATE Usuarios
        SET nombre_usuario = $1, correo = $2, contrasena = $3, imagen = $4, fondos = $5
        WHERE id_usuario = $6
    `;

    db.query(sql, [username, email || null, password, foto_perfil, fondos, id], (err) => {
        if (err) return handleError(res, 'Error al actualizar el usuario.', err);
        res.json({ message: 'Usuario actualizado correctamente.' });
    });
});

// Eliminar un usuario
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send('Faltan datos requeridos: id.');
    }

    const sql = 'DELETE FROM Usuarios WHERE id_usuario = $1';
    db.query(sql, [id], (err) => {
        if (err) return handleError(res, 'Error al eliminar el usuario.', err);
        res.json({ message: 'Usuario eliminado correctamente.' });
    });
});

module.exports = router;
