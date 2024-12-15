const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5, // Ajusta según tus necesidades
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
    process.exit(1); // Finaliza el proceso si hay un error crítico
  } else {
    console.log('Conexión establecida con la base de datos.');
    connection.release(); // Libera la conexión
  }
});

module.exports = pool;
