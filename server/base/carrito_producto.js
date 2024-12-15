const express = require('express');
const db = require('./connection');
const router = express.Router();

router.get('/:id', (req, res) => {
    let {id} = req.params;
    id = parseInt(id.trim().replace(/['"]+/g, ''), 10);

    if (isNaN(id)) {
        return res.status(400).send('El ID debe ser un número válido.');
    }
    const sql = `
        SELECT 
            c.id_carrito_producto AS id,
            p.nombre_producto AS producto,
            c.cantidad AS cantidad,
            p.precio AS precio
        FROM Carrito_Productos c
        LEFT JOIN Producto p ON p.id_producto = c.id_producto
        WHERE c.id_carrito = ?;`;
    db.query(sql,[id],  (err, results) => {
        if (err) return res.status(500).send('Error al obtener los carritos.');
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { id_car, id_pro, cantidad } = req.body;
    console.log(req.body);
    const sql = 'INSERT INTO Carrito_Productos (id_carrito,id_producto,cantidad) VALUES (?,?,?);';
    
    db.query(sql, [id_car,id_pro,cantidad], (err, result) => {
        if (err) return res.status(500).send('Error al agregar el carrito.');
        res.status(201).json({ id: result.insertId });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Carrito_Productos WHERE id_producto = ?';
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).send('Error al eliminar el carrito.');
        res.json({ message: 'Carrito eliminado correctamente.' });
    });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { cantidad } = req.body;

    if (!id || !cantidad) {
        return res.status(400).send('Faltan datos requeridos.');
    }

    const sql = `
        UPDATE Carrito_Productos
        SET cantidad = ?
        WHERE id_producto = ?;
    `;
    db.query(sql, [cantidad, id], (err) => {
        if (err) return handleError(res, 'Error al actualizar el carrito.', err);
        res.json({ message: 'carrito actualizado correctamente.' });
    });
});

module.exports = router;
