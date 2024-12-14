const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
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
