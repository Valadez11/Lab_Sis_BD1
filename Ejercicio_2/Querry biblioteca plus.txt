Querry biblioteca plus

CREATE TABLE autor (
    id_autor INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    nacionalidad VARCHAR(50),
    fecha_nacimiento DATE
);

CREATE TABLE editorial (
    id_editorial INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    pais VARCHAR(50),
    telefono VARCHAR(20)
);

CREATE TABLE libro (
    id_libro INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(200) NOT NULL,
    genero VARCHAR(50),
    id_autor INT,
    FOREIGN KEY (id_autor) REFERENCES autor(id_autor)
);

CREATE TABLE edicion (
    id_edicion INT PRIMARY KEY AUTO_INCREMENT,
    id_libro INT,
    id_editorial INT,
    anio_publicacion YEAR,
    isbn VARCHAR(20) UNIQUE,
    numero_edicion INT,
    FOREIGN KEY (id_libro) REFERENCES libro(id_libro),
    FOREIGN KEY (id_editorial) REFERENCES editorial(id_editorial)
);

CREATE TABLE ejemplar (
    id_ejemplar INT PRIMARY KEY AUTO_INCREMENT,
    id_edicion INT,
    codigo_barras VARCHAR(50) UNIQUE,
    estado VARCHAR(30) DEFAULT 'Disponible',
    ubicacion VARCHAR(100),
    FOREIGN KEY (id_edicion) REFERENCES edicion(id_edicion)
);

CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    correo VARCHAR(150) UNIQUE,
    telefono VARCHAR(20),
    fecha_registro DATE
);

CREATE TABLE prestamo (
    id_prestamo INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    id_ejemplar INT,
    fecha_prestamo DATE,
    fecha_devolucion DATE,
    estado VARCHAR(30) DEFAULT 'Prestado',
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_ejemplar) REFERENCES ejemplar(id_ejemplar)
);

CREATE TABLE reserva (
    id_reserva INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    id_ejemplar INT,
    fecha_reserva DATE,
    estado VARCHAR(30) DEFAULT 'Activa',
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_ejemplar) REFERENCES ejemplar(id_ejemplar)
);


DELIMITER $$

CREATE TRIGGER trg_prestamo_insert
AFTER INSERT ON prestamo
FOR EACH ROW
BEGIN
    UPDATE ejemplar
    SET estado = 'Prestado'
    WHERE id_ejemplar = NEW.id_ejemplar;
END$$

DELIMITER;

DELIMITER $$

CREATE TRIGGER trg_devolucion
AFTER UPDATE ON prestamo
FOR EACH ROW
BEGIN
    IF NEW.estado = 'Devuelto' THEN
        UPDATE ejemplar
        SET estado = 'Disponible'
        WHERE id_ejemplar = NEW.id_ejemplar;
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_validar_prestamo
BEFORE INSERT ON prestamo
FOR EACH ROW
BEGIN
    DECLARE estado_actual VARCHAR(30);

    SELECT estado INTO estado_actual
    FROM ejemplar
    WHERE id_ejemplar = NEW.id_ejemplar;

    IF estado_actual <> 'Disponible' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El ejemplar no está disponible para préstamo';
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_reserva_insert
AFTER INSERT ON reserva
FOR EACH ROW
BEGIN
    UPDATE ejemplar
    SET estado = 'Reservado'
    WHERE id_ejemplar = NEW.id_ejemplar
      AND estado = 'Disponible';
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_reserva_update
AFTER UPDATE ON reserva
FOR EACH ROW
BEGIN
    IF NEW.estado IN ('Cancelada','Expirada') THEN
        UPDATE ejemplar
        SET estado = 'Disponible'
        WHERE id_ejemplar = NEW.id_ejemplar;
    END IF;
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER trg_prestamo_reserva
AFTER INSERT ON prestamo
FOR EACH ROW
BEGIN
    UPDATE reserva
    SET estado = 'Completada'
    WHERE id_usuario = NEW.id_usuario
      AND id_ejemplar = NEW.id_ejemplar
      AND estado = 'Activa';
END$$

DELIMITER ;