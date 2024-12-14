const express = require("express");
const session = require("express-session");
const multer = require("multer");
const passport = require("./base/auth");
const usuario = require("./base/usuarios");
const loginRouter = require("./base/login");
const logoutRouter = require("./base/logout");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const call = require("./base/manejo");
const routerSave = require("./base/Save");
const carrito = require("./base/carritos");
const compras = require("./base/compras");
const productos = require("./base/productos");
const cliente = require("./base/cliente");
const temporada = require("./base/temporada");
const roles = require("./base/roles");
const carros = require("./base/carritos");
const produCar = require("./base/carrito_producto");

// Carga las variables de entorno
dotenv.config();

// Configuración de multer para manejar archivos
const upload = multer({
  storage: multer.memoryStorage(),
}).any();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "imagenes")); // Ruta para guardar imágenes
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Inicialización del servidor Express
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Permitir solicitudes desde el frontend
    credentials: true, // Habilitar envío de cookies
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/imagenes", express.static(path.join(__dirname, "imagenes")));

// Configuración de sesiones en memoria
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Cookies seguras en producción
      httpOnly: true, // Protege contra ataques XSS
      maxAge: 1000 * 60 * 60 * 24, // 1 día
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Rutas de APIs
app.use("/usuarios", usuario);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/manejo", call);
app.use("/save", routerSave);
app.use("/cliente", cliente);
app.use("/roles", roles);
app.use("/productos", productos);
app.use("/temporada", temporada);
app.use("/carros", carros);
app.use("/proCar", produCar);
app.use("/compras", compras);

// Ruta de autenticación con Google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

const BASE_URL = process.env.FRONTEND_URL || "http://localhost:3000";

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    try {
      const user = {
        id: req.user.id_usuario,
        username: req.user.nombre_usuario,
        email: req.user.correo,
        imagen: req.user.imagen,
        fondos: req.user.fondos || 0,
      };

      const queryParams = new URLSearchParams({
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        imagen: user.imagen,
        fondos: user.fondos.toString(),
        message: "Sesión iniciada con éxito",
      });

      res.redirect(`${BASE_URL}/dashboard?${queryParams}`);
    } catch (error) {
      console.error("Error durante el callback de Google:", error);
      res.redirect(`${BASE_URL}/error?message=Error durante la autenticación`);
    }
  }
);

// Ruta de prueba
app.get("/", (req, res) => {
  if (!req.session.viewCount) req.session.viewCount = 1;
  else req.session.viewCount += 1;

  res.send(`Visitas: ${req.session.viewCount}`);
});

app.disable("etag");

// Inicialización del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
