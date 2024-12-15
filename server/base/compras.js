const express = require('express');
const db = require('./connection');
const router = express.Router();

// Middleware para validar IDs como números
const validateNumericId = (req, res, next) => {
    const { id } = req.params;
    if (id && !/^[0-9]+$/.test(id)) {
        return res.status(400).send('El ID debe ser un número válido.');
    }
    next();
};

// Obtener información de compras
router.get('/:id',  (req, res) => {
    let {id} = req.params;
    id = parseInt(id.trim().replace(/['"]+/g, ''), 10);

    if (isNaN(id)) {
        return res.status(400).send('El ID debe ser un número válido.');
    }

    const query = `
        SELECT 
    c.numero_venta AS numero,
    c.fecha_compra AS fecha,
    c.total AS total,
    cp.cantidad as cantidad,
    cp.cantidad * cp.precio_unitario AS total_u,
    cp.precio_unitario AS precio,
    p.nombre_producto AS nombre
FROM 
    Compras c
INNER JOIN 
    Compra_Productos cp ON c.id_compra = cp.id_compra
INNER JOIN 
    Producto p ON cp.id_producto = p.id_producto
WHERE 
    c.id_usuario = ?
ORDER BY 
    c.fecha_compra DESC;
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Ruta para obtener la última compra realizada
router.get('/ultimo/:id', (req, res) => {
    let { id } = req.params;

    // Limpieza y validación del ID
    id = parseInt(id.trim().replace(/['"]+/g, ''), 10);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'El ID debe ser un número entero positivo.' });
    }

    const query = `
        SELECT 
            c.numero_venta AS numero,
            cp.cantidad as cantidad,
            c.fecha_compra AS fecha,
            c.total AS total,
            cp.cantidad * cp.precio_unitario AS total_u,
            cp.precio_unitario AS precio,
            p.nombre_producto AS nombre
        FROM 
            Compras c
        INNER JOIN 
            Compra_Productos cp ON c.id_compra = cp.id_compra
        INNER JOIN 
            Producto p ON cp.id_producto = p.id_producto
        WHERE 
            c.id_usuario = ?
        ORDER BY 
            c.fecha_compra DESC
        LIMIT 1;
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al ejecutar la consulta.', details: err.message });
        }

        // Retorna el resultado o un objeto vacío si no hay registros
        res.json(results.length > 0 ? results[0] : {});
    });
});


// Crear una compra
router.post('/', (req, res) => {
    const { id_carrito, id_usuario: rawIdUsuario } = req.body;

    // Limpiar y validar `id_usuario`
    const id_usuario = parseInt(
        String(rawIdUsuario).trim().replace(/['"]+/g, ''),
        10
    );

    if (isNaN(id_usuario)) {
        return res.status(400).send('El ID del usuario debe ser un número válido.');
    }

    console.log("ID de usuario validado:", id_usuario);

    // Validar que los IDs sean números
    if (!Number.isInteger(Number(id_carrito)) || !Number.isInteger(Number(id_usuario))) {
        return res.status(400).send('Los IDs deben ser números válidos.');
    }

    // Usar una conexión del pool
    db.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener la conexión:", err);
            return res.status(500).send('Error al procesar la compra.');
        }

        // Iniciar transacción
        connection.beginTransaction(err => {
            if (err) {
                connection.release();
                console.error("Error al iniciar la transacción:", err);
                return res.status(500).send('Error al procesar la compra.');
            }

            // Consultar productos del carrito
            const sqlCarrito = `
                SELECT 
                    c.id_carrito_producto AS id,
                    p.nombre_producto AS producto,
                    c.cantidad AS cantidad,
                    p.precio AS precio,
                    c.id_producto
                FROM Carrito_Productos c 
                LEFT JOIN Producto p ON p.id_producto = c.id_producto 
                WHERE c.id_carrito = ?;`;

            connection.query(sqlCarrito, [id_carrito], (err, carritoItems) => {
                if (err) {
                    connection.rollback(() => connection.release());
                    console.error("Error al obtener el carrito:", err);
                    return res.status(500).send('Error al procesar la compra.');
                }

                // Calcular el total de la compra
                const totalCompra = carritoItems.reduce((total, item) => total + item.cantidad * item.precio, 0);

                // Verificar fondos del usuario
                const sqlUsuario = 'SELECT fondos FROM Usuarios WHERE id_usuario = ?';
                connection.query(sqlUsuario, [id_usuario], (err, results) => {
                    if (err || results.length === 0) {
                        connection.rollback(() => connection.release());
                        console.error("Error al verificar fondos del usuario:", err);
                        return res.status(500).send('Error al procesar la compra.');
                    }

                    const fondosUsuario = results[0].fondos;
                    if (fondosUsuario < totalCompra) {
                        connection.rollback(() => connection.release());
                        return res.status(400).send('Fondos insuficientes.');
                    }

                    // Actualizar fondos del usuario
                    const sqlActualizarFondos = 'UPDATE Usuarios SET fondos = fondos - ? WHERE id_usuario = ?';
                    connection.query(sqlActualizarFondos, [totalCompra, id_usuario], (err) => {
                        if (err) {
                            connection.rollback(() => connection.release());
                            console.error("Error al actualizar fondos del usuario:", err);
                            return res.status(500).send('Error al procesar la compra.');
                        }

                        // Actualizar inventario de productos
                        const updates = carritoItems.map(item => {
                            return new Promise((resolve, reject) => {
                                const sqlActualizarInventario = 'UPDATE Producto SET piezas = piezas - ? WHERE id_producto = ?';
                                connection.query(sqlActualizarInventario, [item.cantidad, item.id_producto], (err) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve();
                                    }
                                });
                            });
                        });

                        Promise.all(updates)
                            .then(() => {
                                // Registrar la compra
                                const sqlCrearCompra = 'CALL CrearCompra(?, ?, @id_compra);';
                                connection.query(sqlCrearCompra, [id_carrito, id_usuario], (err) => {
                                    if (err) {
                                        connection.rollback(() => connection.release());
                                        console.error("Error al registrar la compra:", err);
                                        return res.status(500).send('Error al procesar la compra.');
                                    }

                                    // Finalizar la transacción
                                    connection.commit(err => {
                                        connection.release();
                                        if (err) {
                                            connection.rollback(() => connection.release());
                                            console.error("Error al finalizar la transacción:", err);
                                            return res.status(500).send('Error al procesar la compra.');
                                        }

                                        res.status(201).json({ message: 'Compra registrada exitosamente.' });
                                    });
                                });
                            })
                            .catch(err => {
                                connection.rollback(() => connection.release());
                                console.error("Error al actualizar el inventario:", err);
                                return res.status(500).send('Error al procesar la compra.');
                            });
                    });
                });
            });
        });
    });
});

// Eliminar una compra
router.delete('/:id', validateNumericId, (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Compras WHERE id_compra = ?';
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).send('Error al eliminar la compra.');
        res.json({ message: 'Compra eliminada correctamente.' });
    });
});

module.exports = router;
