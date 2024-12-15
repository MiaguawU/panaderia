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
    id = id.replace(/^"|"$/g, ''); // Elimina las comillas al inicio y al final

    console.log("ID limpio:", id);

    const sql = 'SELECT * FROM Usuarios WHERE id_usuario = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return handleError(res, 'Error al obtener los usuarios.', err);
        res.json(results);
        console.log(results);
    });
});

// Agregar un nuevo usuario y su carrito
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Faltan datos requeridos: username o password.');
    }

    const sql = `
        INSERT INTO Usuarios (nombre_usuario, contrasena, id_rol, imagen, fondos)
        VALUES (?, ?, 2, 'https://i.pinimg.com/736x/ea/55/a7/ea55a756b236f936d4e9f2b8c356bdaf.jpg', 0)
    `;
    
    const sql2 = `
        INSERT INTO Carritos (id_usuario) VALUE (?)
    `;

    try {
        // Inserción del nuevo usuario
        const result = await new Promise((resolve, reject) => {
            db.query(sql, [username, password], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });

        const id_usuario = result.insertId;

        // Inserción del carrito asociado al usuario
        await new Promise((resolve, reject) => {
            db.query(sql2, [id_usuario], (err1, result1) => {
                if (err1) reject(err1);
                resolve(result1);
            });
        });

        res.status(201).json({ id: id_usuario, message: 'Usuario y carrito creados exitosamente.' });
    } catch (err) {
        handleError(res, 'Error al crear el usuario o el carrito.', err);
    }
});

// Actualizar un usuario
router.put('/:id', (req, res) => {
    let {id} = req.params;
    id = parseInt(id.trim().replace(/['"]+/g, ''), 10);

    if (isNaN(id)) {
        return res.status(400).send('El ID debe ser un número válido.');
    }

    const { username, email, password, foto_perfil, fondos } = req.body;

    if (!id || !username || !password || !foto_perfil || fondos == null) {
        return res.status(400).send('Faltan datos requeridos.');
    }

    const sql = `
        UPDATE Usuarios
        SET nombre_usuario = ?, correo = ?, contrasena = ?, imagen = ?, fondos = ?
        WHERE id_usuario = ?
    `;
    db.query(sql, [username, email, password, foto_perfil, fondos, id], (err) => {
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

    const sql = 'DELETE FROM Usuarios WHERE id_usuario = ?';
    db.query(sql, [id], (err) => {
        if (err) return handleError(res, 'Error al eliminar el usuario.', err);
        res.json({ message: 'Usuario eliminado correctamente.' });
    });
});

module.exports = router;
