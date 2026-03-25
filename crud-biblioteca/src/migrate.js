function migrateIfNeeded(db) {
  console.log("⏳ Revisando y preparando la base de datos...");

  const sql = `
    -- 1. Crear tabla autor
    CREATE TABLE IF NOT EXISTS autor (
        id_autor INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        nacionalidad TEXT,
        fecha_nacimiento TEXT
    );

    -- 2. Crear tabla editorial
    CREATE TABLE IF NOT EXISTS editorial (
        id_editorial INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        pais TEXT,
        telefono TEXT
    );

    -- 3. Crear tabla libro
    CREATE TABLE IF NOT EXISTS libro (
        id_libro INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        genero TEXT,
        id_autor INTEGER,
        FOREIGN KEY (id_autor) REFERENCES autor(id_autor) ON DELETE CASCADE
    );

    -- 4. Insertar datos de prueba (Solo se insertan si la tabla está vacía)
    INSERT INTO autor (nombre, nacionalidad, fecha_nacimiento)
    SELECT 'Gabriel García Márquez', 'Colombiana', '1927-03-06'
    WHERE NOT EXISTS (SELECT 1 FROM autor);

    INSERT INTO autor (nombre, nacionalidad, fecha_nacimiento)
    SELECT 'J.K. Rowling', 'Británica', '1965-07-31'
    WHERE NOT EXISTS (SELECT 1 FROM autor WHERE nombre = 'J.K. Rowling');

    INSERT INTO libro (titulo, genero, id_autor)
    SELECT 'Cien años de soledad', 'Realismo mágico', 1
    WHERE NOT EXISTS (SELECT 1 FROM libro);

    INSERT INTO libro (titulo, genero, id_autor)
    SELECT 'Harry Potter y la piedra filosofal', 'Fantasía', 2
    WHERE NOT EXISTS (SELECT 1 FROM libro WHERE titulo = 'Harry Potter y la piedra filosofal');
  `;

  // db.exec ejecuta todo el bloque de texto SQL de golpe
  db.exec(sql);
  
  console.log("✅ Tablas y datos iniciales listos.");
}

module.exports = { migrateIfNeeded };