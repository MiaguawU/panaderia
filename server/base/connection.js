const mysql = require('mysql2/promise'); // Usamos la versión `promise` de mysql2
const dotenv = require('dotenv');

dotenv.config();

// Crear un pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // Espera si no hay conexiones disponibles
  connectionLimit: 5, // Límite de conexiones simultáneas
  queueLimit: 0, // Sin límite en la cola de solicitudes de conexión
});

// Probar la conexión al inicializar el servidor
(async () => {
  try {
    console.log('Intentando conectar a la base de datos...');
    const connection = await pool.getConnection();
    console.log('¡Conexión exitosa a la base de datos!');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Base de datos: ${process.env.DB_NAME}`);
    connection.release(); // Liberar la conexión al pool
  } catch (err) {
    console.error('Error al conectar con la base de datos:', err.message);
    console.error('Por favor verifica las variables de entorno y la configuración del servidor.');
    process.exit(1); // Finaliza el proceso si hay un error crítico
  }
})();

module.exports = pool;
