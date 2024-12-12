const express = require('express');
const db = require('./connection');
const router = express.Router();

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Roles';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send('Error al obtener los roles.');
        res.json(results);
        console.log(results);
    });
});

router.post('/', (req, res) => {
    const { nombre_rol } = req.body;
    const sql = 'INSERT INTO Roles (nombre_rol) VALUES (?)';
    db.query(sql, [nombre_rol], (err, result) => {
        if (err) return res.status(500).send('Error al agregar el rol.');
        res.status(201).json({ id: result.insertId });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Roles WHERE id_rol = ?';
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).send('Error al eliminar el rol.');
        res.json({ message: 'Rol eliminado correctamente.' });
    });
});

module.exports = router;
