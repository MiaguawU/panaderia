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
const carrito = require ("./base/carritos");
const compras = require("./base/compras");
const productos = require("./base/productos");
const cliente = require("./base/cliente");
const temporada = require("./base/temporada");
const roles = require("./base/roles");
const carros =require("./base/carritos");
const produCar = require("./base/carrito_producto");

dotenv.config();

// Configuración de multer para manejo de archivos
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

// Inicialización del servidor
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/imagenes", express.static(path.join(__dirname, "imagenes")));

// Configuración de sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());


// Rutas de usuarios
app.use("/usuarios", usuario);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/manejo",call)
app.use("/save", routerSave);
app.use("/cliente", cliente);
app.use("/roles", roles)

// Ruta de autenticación con Google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

const BASE_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Callback después de autenticación con Google
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    try {
      // Datos del usuario autenticado
      const user = {
        id: req.user.id_usuario,
        username: req.user.nombre_usuario,
        email: req.user.correo,
        imagen: req.user.imagen,
        fondos: req.user.fondos || 0,
      };

      // Serializar datos del usuario
      const queryParams = new URLSearchParams({
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        imagen: user.imagen,
        fondos: user.fondos.toString(),
        message: "Sesión iniciada con éxito",
      });

      // Redirigir al frontend con los datos
      res.redirect(`${REACT_APP_API_URL}/dashboard?${queryParams}`);
    } catch (error) {
      console.error("Error durante el callback de Google:", error);
      res.redirect(`${REACT_APP_API_URL}/error?message=Error durante la autenticación`);
    }
  }
);

//panes
app.use("/productos",productos);

//temporadas
app.use("/temporada", temporada);

//carrits
app.use("/carros", carros);
app.use("/proCar", produCar);

//compras
app.use("/compras", compras);

app.disable("etag");

const PORT = process.env.SERVER_PORT ;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
