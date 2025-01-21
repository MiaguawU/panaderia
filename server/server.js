const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const passport = require("./base/auth");
const usuario = require("./base/usuarios");
const loginRouter = require("./base/login");
const logoutRouter = require("./base/logout");
const call = require("./base/manejo");
const routerSave = require("./base/Save");
const cliente = require("./base/cliente");
const roles = require("./base/roles");
const productos = require("./base/productos");
const temporada = require("./base/temporada");
const carros = require("./base/carritos");
const produCar = require("./base/carrito_producto");
const compras = require("./base/compras");

// Cargar variables de entorno
dotenv.config();

// Configuración de conexión a MySQL
const dbOptions = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Inicializa MySQLStore
const sessionStore = new MySQLStore(dbOptions);

// Inicializa el servidor Express
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/imagenes", express.static(path.join(__dirname, "imagenes")));

// Configuración de sesiones con MySQLStore
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore, // Almacenamiento de sesiones en MySQL
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 día
    },
  })
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

const BASE_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Ruta de callback después de la autenticación con Google
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    try {
      // Datos del usuario autenticado
      const user = {
        id: req.user.Id_Usuario,
        username: req.user.Nombre_Usuario,
        email: req.user.Email,
        foto_perfil: req.user.foto_perfil,
        Cohabitantes: req.user.Cohabitantes || null,
      };

      // Crear un JWT (opcional, si no usas sesiones)
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1d" });

      // Redirigir al front con el token en un header o en una cookie
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    } catch (error) {
      console.error("Error durante el callback de Google:", error);
      res.redirect(`${process.env.FRONTEND_URL}/error?message=Error durante la autenticación`);
    }
  }
);

app.get("/auth/me", (req, res) => {
  const token = req.cookies.auth_token; // Leer el token desde las cookies
  if (!token) {
    return res.status(401).json({ message: "No autenticado" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json(user); // Devuelve los datos del usuario
  } catch (err) {
    res.status(401).json({ message: "Token inválido" });
  }
});


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
