const express = require('express');
const db = require('./connection');
const router = express.Router();

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Usuarios';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send('Error al obtener los usuarios.');
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { nombre_usuario, correo, contrasena, id_rol, imagen, fondos } = req.body;
    const sql = 'INSERT INTO Usuarios (nombre_usuario, correo, contrasena, id_rol, imagen, fondos) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [nombre_usuario, correo, contrasena, id_rol, imagen, fondos], (err, result) => {
        if (err) return res.status(500).send('Error al agregar el usuario.');
        res.status(201).json({ id: result.insertId });
    });
});

router.post('/', (req, res) => {
    const { nombre_usuario, correo, contrasena, id_rol, imagen, fondos } = req.body;

    if (!nombre_usuario || !correo || !contrasena || !id_rol) {
        return res.status(400).send('Faltan datos obligatorios.');
    }

    const sql = 'INSERT INTO Usuarios (nombre_usuario, correo, contrasena, id_rol, imagen, fondos) VALUES (?, ?, ?, ?, ?, ?)';
    const sql2 = `
        INSERT INTO carritos (id_usuario)
        VALUES (?)
    `;
    db.query(sql, [username, password], (err, result) => {
        if (err) return handleError(res, 'Error al agregar el usuario.', err);
        const id_usuario = result.insertId;
        db.query(sql2, [id_usuario], (err1, result1) => {
            if (err1) return handleError(res, 'Error al agregar carrito.', err);
            
        });
        res.status(201).json({ id: result.insertId });
    });
});

// Ruta PUT: Actualizar un usuario
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre_usuario, correo, contrasena, id_rol, imagen, fondos } = req.body;
    console.log(req.body);

    const sql = 'UPDATE Usuarios SET nombre_usuario = ?, correo = ?, contrasena = ?, id_rol = ?, imagen = ?, fondos = ? WHERE id_usuario = ?';
    db.query(sql, [nombre_usuario, correo, contrasena, id_rol, imagen, fondos, id], (err) => {
        if (err) {
            console.error('Error al actualizar el usuario:', err);
            return res.status(500).send('Error al actualizar el usuario.');
        }
        res.json({ message: 'Usuario actualizado correctamente.' });
    });
});


router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'CALL EliminarUsuario(?);';
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).send('Error al eliminar el usuario.');
        res.json({ message: 'Usuario eliminado correctamente.' });
    });
});

module.exports = router;
