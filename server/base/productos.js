const express = require('express');
const db = require('./connection');
const router = express.Router();

router.get('/', (req, res) => {
    const sql = `
        SELECT 
            Producto.id_producto, 
            Producto.nombre_producto, 
            Producto.precio, 
            Producto.descripcion,
            Producto.piezas, 
            Producto.imagen_url, 
            Temporada.temporada AS temporada
        FROM Producto
        LEFT JOIN Temporada ON Producto.id_temporada = Temporada.id_temporada;
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send('Error al obtener los productos.');
        res.json(results);
    });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT 
            Producto.nombre_producto, 
            Producto.precio, 
            Producto.descripcion,
            Producto.piezas, 
            Producto.imagen_url, 
            Producto.id_temporada 
        FROM Producto
        where id_producto = ?;
    `;
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).send('Error al obtener los productos.');
        res.json(results);
    });
});
router.post('/', (req, res) => {
    const { nombre_producto, precio, descripcion, piezas, imagen_url, id_temporada } = req.body;
    const sql = 'INSERT INTO Producto (nombre_producto, precio, descripcion, piezas, imagen_url, id_temporada) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [nombre_producto, precio, descripcion, piezas, imagen_url, id_temporada], (err, result) => {
        if (err) return res.status(500).send('Error al agregar el producto.');
        res.status(201).json({ id: result.insertId });
    });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre_producto, precio, descripcion, piezas, imagen_url, id_temporada } = req.body;
    const sql = 'UPDATE Producto SET nombre_producto = ?, precio = ?, descripcion = ?, piezas = ?, imagen_url = ?, id_temporada = ? WHERE id_producto = ?';
    db.query(sql, [nombre_producto, precio, descripcion, piezas, imagen_url, id_temporada, id], (err) => {
        if (err) return res.status(500).send('Error al actualizar el producto.');
        res.json({ message: 'Producto actualizado correctamente.' });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Producto WHERE id_producto = ?';
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).send('Error al eliminar el producto.');
        res.json({ message: 'Producto eliminado correctamente.' });
    });
});

module.exports = router;
