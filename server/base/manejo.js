const express = require("express");
const router = express.Router();
const passport = require("./auth");

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Redirigir al cliente con datos en la query string o devolver los datos como JSON.
    res.redirect(
      `/auth/success?id=${req.user.Id_Usuario}&username=${encodeURIComponent(
        req.user.Nombre_Usuario
      )}&email=${encodeURIComponent(req.user.Email)}&foto=${encodeURIComponent(
        req.user.foto_perfil
      )}&cohabitantes=${req.user.Cohabitantes || ""}`
    );
  }
);

module.exports = router;