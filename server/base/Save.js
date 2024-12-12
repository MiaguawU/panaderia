const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    const userData = req.body;
    console.log("Datos recibidos:", userData);
    res.json({ message: "Datos guardados exitosamente" });
  });
  
  module.exports = router;