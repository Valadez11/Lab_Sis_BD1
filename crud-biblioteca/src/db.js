const Database = require("better-sqlite3");
const path = require("path");
const { migrateIfNeeded } = require("./migrate");

function openDb() {
  // Busca la ruta de la base de datos
  const dbPath = process.env.DB_PATH 
    ? path.resolve(process.env.DB_PATH) 
    : path.join(process.cwd(), "biblioteca.db");

  // Abre la conexión (si el archivo no existe, lo crea automáticamente)
  const db = new Database(dbPath);
  
  // Optimizaciones recomendadas para SQLite
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON"); // Obliga a respetar las relaciones entre tablas
  
  migrateIfNeeded(db);

  return db;
}

module.exports = { openDb };