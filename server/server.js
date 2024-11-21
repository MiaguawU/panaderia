const express = require('express'); 
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ch0pp3r',
    database: 'panaderia',
});

app.get('/api/producto', (req, res) => {
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
        if (err) {
            console.error(err);
            return res.status(500).send('Error al obtener los productos.');
        }
        res.json(results);
    });
});

app.get('/api/temporadas', (req, res) => {
    const { simple } = req.query; 
    const sql = simple
        ? `SELECT id_temporada, temporada FROM Temporada`
        : `
            SELECT 
                id_temporada, 
                temporada, 
                fecha_inicio, 
                fecha_termino 
            FROM Temporada
        `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener las temporadas:', err);
            return res.status(500).send('Error al obtener las temporadas.');
        }
        res.json(results);
    });
});

app.post('/api/agregar', (req, res) => {
    const { nombre_producto, precio, descripcion, piezas, imagen_url, id_temporada } = req.body;
    const sql = `
        INSERT INTO Producto (nombre_producto, precio, descripcion, piezas, imagen_url, id_temporada)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [nombre_producto, precio, descripcion, piezas, imagen_url, id_temporada], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al agregar el producto.');
        }
        res.json({ message: 'Producto agregado con éxito', id: results.insertId });
    });
});

app.delete('/api/eliminar/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM Producto WHERE id_producto = ?`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al eliminar el producto.');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Producto no encontrado.');
        }
        res.json({ message: 'Producto eliminado con éxito' });
    });
});

app.put('/api/actualizar/:id', (req, res) => {
    const { id } = req.params;
    const { nombre_producto, precio, descripcion, piezas, imagen_url, id_temporada } = req.body;
    const sql = `
        UPDATE Producto
        SET 
            nombre_producto = ?, 
            precio = ?, 
            descripcion = ?, 
            piezas = ?, 
            imagen_url = ?, 
            id_temporada = ?
        WHERE id_producto = ?
    `;
    db.query(
        sql,
        [nombre_producto, precio, descripcion, piezas, imagen_url, id_temporada, id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error al actualizar el producto.');
            }
            if (results.affectedRows === 0) {
                return res.status(404).send('Producto no encontrado.');
            }
            res.json({ message: 'Producto actualizado con éxito' });
        }
    );
});

const PORT = 10000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
