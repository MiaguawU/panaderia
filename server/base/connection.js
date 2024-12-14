const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.PORT,
  ssl: {
    rejectUnauthorized: false, // Requerido para conexiones SSL con Render
  },
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
    process.exit(1);
  }
  console.log('Se pudo conectar a la base');
  release(); // Libera el cliente después de la conexión
});

module.exports = pool;
