const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("./connection");

// Configuración de la estrategia de Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET, // Corregido para que use la variable correcta
      callbackURL: `${process.env.REACT_APP_API_URL}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const nombre = profile.displayName;
        const fotoPerfil = profile.photos[0].value;

        db.query("SELECT * FROM Usuarios WHERE correo = ?", [email], (err, results) => {
          if (err) return done(err);

          if (results.length > 0) {
            // Usuario existente: actualizar datos si han cambiado
            const usuarioExistente = results[0];
            if (
              usuarioExistente.nombre_usuario !== nombre || 
              usuarioExistente.imagen !== fotoPerfil
            ) {
              const query = "UPDATE Usuarios SET nombre_usuario = ?, imagen = ? WHERE correo = ?";
              db.query(query, [nombre, fotoPerfil, email], (updateErr) => {
                if (updateErr) return done(updateErr);

                usuarioExistente.nombre_usuario = nombre;
                usuarioExistente.imagen = fotoPerfil;
                return done(null, usuarioExistente); // Usuario actualizado
              });
            } else {
              return done(null, usuarioExistente); // Datos ya están actualizados
            }
          } else {
            // Usuario nuevo: insertar datos
            const contrasenaPredeterminada = "sopaDEpollo22"; // Contraseña temporal
            const idRol = 2; // Rol predeterminado para nuevos usuarios
            const query =
              "INSERT INTO Usuarios (nombre_usuario, correo, contrasena, id_rol, imagen) VALUES (?, ?, ?, ?, ?)";
            
            db.query(query, [nombre, email, contrasenaPredeterminada, idRol, fotoPerfil], (insertErr, result) => {
              if (insertErr) return done(insertErr);

              const id_usuario = result.insertId; // Obtener el ID del nuevo usuario
              const sql2 = "INSERT INTO carritos (id_usuario) VALUES (?)";
              
              db.query(sql2, [id_usuario], (carritoErr) => {
                if (carritoErr) {
                  console.error("Error al crear carrito:", carritoErr);
                  return done(carritoErr); // Fallo al crear el carrito
                }

                const newUser = {
                  id_usuario,
                  nombre_usuario: nombre,
                  correo: email,
                  imagen: fotoPerfil,
                  id_rol: idRol,
                  fondos: 0,
                };
                return done(null, newUser); // Usuario y carrito creados
              });
            });
          }
        });
      } catch (error) {
        console.error("Error en la estrategia de Google:", error);
        return done(error);
      }
    }
  )
);

// Serialización del usuario
passport.serializeUser((user, done) => {
  done(null, user.id_usuario);
});

// Deserialización del usuario
passport.deserializeUser((id, done) => {
  db.query("SELECT * FROM Usuarios WHERE id_usuario = ?", [id], (err, results) => {
    if (err) return done(err);
    if (results.length === 0) {
      return done(new Error("Usuario no encontrado"));
    }
    done(null, results[0]);
  });
});

module.exports = passport;
