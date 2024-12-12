const express = require('express'); 
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();


router.get('/', (req, res) => {
    const sql =  `
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



module.exports = router;
