const { Pool } = require('pg');
const dotenv = require('dotenv');

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://isis:Y8tRALKJl49GVA5vGbmeTrCxGQRRqq3u@dpg-ctdm3aij1k6c73drhuug-a.oregon-postgres.render.com/panaderia2',
  ssl: {
    rejectUnauthorized: false, // Necesario para Render
  },
});

// Probar la conexión
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
    process.exit(1);
  }
  console.log('Se pudo conectar a la base de datos.');
  release(); // Libera el cliente después de la conexión
});

module.exports = pool;
