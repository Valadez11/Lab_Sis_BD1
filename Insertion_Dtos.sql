INSERT INTO autor(nombre, nacionalidad, fecha_nacimiento) VALUES
('Gabriel García Márquez', 'Colombiana', '1927-03-06'),
('Isable Gonzales', 'Española', '1950-07-15'),
('J.K. Rowling', 'Británica', '1965-07-31');

INSERT INTO editorial (nombre, pais, telefono) VALUES
('Editorial Planeta','España','5551112233'),
('Penguin Random House','Estados Unidos','5552223344'),
('Editorial Sudamericana', 'Argentina', '5553334455');

INSERT INTO libro (titulo, genero, id_autor)
SELECT 'Cien años de soledad','Realismo mágico', a.id_autor
FROM autor a WHERE a.nombre = 'Gabriel García Márquez'
UNION ALL
SELECT 'Harry Potter y la piedra filosofal','Fantasía', a.id_autor
FROM autor a WHERE a.nombre = 'J.K. Rowling'
UNION ALL
SELECT '1984','Distopía', a.id_autor
FROM autor a WHERE a.nombre = 'George Orwell';


INSERT INTO edicion (id_libro, id_editorial, anio_publicacion, isbn, numero_edicion) VALUES
(1,1,2001,'ISBN-1111',1),
(2,2,1997,'ISBN-2222',1),
(3,2,1949,'ISBN-3333',1),
(1,2,2010,'ISBN-4444',2);

INSERT INTO ejemplar (id_edicion, codigo_barras, estado, ubicacion) VALUES
(1,'CB001','Disponible','Estante A1'),
(1,'CB002','Disponible','Estante A1'),
(2,'CB003','Disponible','Estante B2'),
(3,'CB004','Disponible','Estante C3'),
(4,'CB005','Disponible','Estante A2');

INSERT INTO usuario (nombre, correo, telefono, fecha_registro) VALUES
('Juan Pérez','juan@mail.com','5551110001','2026-01-10'),
('Ana Torres','ana@mail.com','5551110002','2026-01-12'),
('Luis Ramírez','luis@mail.com','5551110003','2026-01-15');

INSERT INTO prestamo (id_usuario, id_ejemplar, fecha_prestamo, fecha_devolucion, estado) VALUES
(1,1,'2026-02-01','2026-02-10','Prestado'),
(2,3,'2026-02-05','2026-02-15','Prestado');

INSERT INTO reserva (id_usuario, id_ejemplar, fecha_reserva, estado) VALUES
(3,2,'2026-02-18','Activa'),
(1,4,'2026-02-18','Activa');

CREATE TABLE historial_prestamos (
    id_historial INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(100),
    libro VARCHAR(200),
    fecha DATE
);

INSERT INTO historial_prestamos (usuario, libro, fecha)
SELECT u.nombre, l.titulo, p.fecha_prestamo
FROM prestamo p
JOIN usuario u ON p.id_usuario = u.id_usuario
JOIN ejemplar ej ON p.id_ejemplar = ej.id_ejemplar
JOIN edicion ed ON ej.id_edicion = ed.id_edicion
JOIN libro l ON ed.id_libro = l.id_libro;






