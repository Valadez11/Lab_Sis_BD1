const express = require("express");
const { openDb } = require("./db");

function apiRouter() {
  const router = express.Router();
  const db = openDb();

  // Aquí irán nuestras rutas (GET, POST, PUT, DELETE)
  router.get("/libros", (req, res) => {
    res.json({ mensaje: "Aquí enviaremos la lista de libros pronto" });
  });

  return router;
}

module.exports = apiRouter;