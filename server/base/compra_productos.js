const express = require('express');
const db = require('./connection');
const router = express.Router();

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Compra_Productos';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send('Error al obtener los productos de las compras.');
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { id_compra, id_producto, cantidad, precio_unitario } = req.body;
    const sql = 'INSERT INTO Compra_Productos (id_compra, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)';
    db.query(sql, [id_compra, id_producto, cantidad, precio_unitario], (err, result) => {
        if (err) return res.status(500).send('Error al agregar el producto a la compra.');
        res.status(201).json({ id: result.insertId });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Compra_Productos WHERE id_compra_producto = ?';
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).send('Error al eliminar el producto de la compra.');
        res.json({ message: 'Producto eliminado de la compra correctamente.' });
    });
});

module.exports = router;
