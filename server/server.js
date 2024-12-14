const express = require("express");
const session = require("express-session");
const { RedisStore } = require("connect-redis");
const Redis = require("ioredis");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Carga las variables de entorno
dotenv.config();

// Inicializa el cliente de Redis con ioredis
const redisClient = new Redis({
  host: process.env.DB_HOST, // Host del servidor Redis
  port: process.env.REDIS_PORT || 6379, // Puerto de Redis
  password: process.env.DB_PASSWORD || null, // Contraseña (si aplica)
});

// Conexión a Redis
redisClient.on("connect", () => {
  console.log("Conectado a Redis correctamente");
});

redisClient.on("error", (err) => {
  console.error("Error en la conexión a Redis:", err);
});

// Inicializa RedisStore
const redisStore = new RedisStore({
  client: redisClient, // Cliente Redis
  prefix: "myapp:", // Prefijo opcional para las claves
});

// Inicializa el servidor Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Configuración de la sesión con Redis
app.use(
  session({
    store: redisStore, // Uso de RedisStore como almacenamiento de sesiones
    secret: process.env.SESSION_SECRET || "defaultSecret", // Clave secreta
    resave: false, // No guarda la sesión si no se modifica
    saveUninitialized: false, // No guarda sesiones vacías
    cookie: {
      secure: process.env.NODE_ENV === "production", // Cookies seguras en producción
      httpOnly: true, // Protege contra ataques XSS
      maxAge: 1000 * 60 * 60 * 24, // Expira en 1 día
    },
  })
);

// Ruta de prueba para verificar sesiones
app.get("/", (req, res) => {
  if (!req.session.viewCount) {
    req.session.viewCount = 1;
  } else {
    req.session.viewCount += 1;
  }
  res.send(`Visitas: ${req.session.viewCount}`);
});

// Configuración de archivos estáticos
app.use("/imagenes", express.static(path.join(__dirname, "imagenes")));

// Inicializa el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
