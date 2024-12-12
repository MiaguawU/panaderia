const express = require('express');
const db = require('./connection');
const router = express.Router();

router.get('/:id', (req, res) => {
    let {id} = req.params;
    id = parseInt(id.trim().replace(/['"]+/g, ''), 10);

    if (isNaN(id)) {
        return res.status(400).send('El ID debe ser un número válido.');
    }
    console.log(id);
    const sql = `
        SELECT id_carrito from carritos where id_usuario = ?;
    `;
    db.query(sql, [id],(err, results) => {
        if (err) return res.status(500).send('Error al obtener los carritos.');
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { id_usuario } = req.body;
    const sql = 'INSERT INTO Carritos (id_usuario) VALUES (?)';
    db.query(sql, [id_usuario], (err, result) => {
        if (err) return res.status(500).send('Error al agregar el carrito.');
        res.status(201).json({ id: result.insertId });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Carritos WHERE id_carrito = ?';
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).send('Error al eliminar el carrito.');
        res.json({ message: 'Carrito eliminado correctamente.' });
    });
});

module.exports = router;
