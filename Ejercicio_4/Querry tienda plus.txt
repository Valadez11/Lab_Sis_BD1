Querry tienda plus

CREATE TABLE Clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR (50) NOT NULL,
    telefono VARCHAR(15),
    direccion VARCHAR(100),
    email VARCHAR(100) NOT NULL UNIQUE,
    fecha_registro DATE NOT NULL

);

CREATE TABLE empleados(
    id_empleado INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    telefono VARCHAR(15),
    puesto VARCHAR(50) NOT NULL,
    fecha_contratacion DATE NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE

);

CREATE TABLE proveedores (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(15),
    empresa VARCHAR(100)NOT NULL
);

CREATE TABLE categorias(
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200) 
);

CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_prodcuto VARCHAR(100) NOT NULL,
    precio_venta DECIMAL(10, 2) NOT NULL,
    precio_compra DECIMAL(10, 2) NOT NULL,
    desccripcion VARCHAR(200),
    id_categoria INT,
    id_proveedor INT,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor)
);

CREATE TABLE ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    total DECIMAL(10, 2)NOT NULL,
    fecha_venta DATE NOT NULL,
    id_cliente INT,
    id_empleado INT,
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente),
    FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
);

CREATE TABLE compras (
    id_compra INT AUTO_INCREMENT PRIMARY KEY,
    total DECIMAL(10, 2) NOT NULL,
    fecha_compra DATE NOT NULL,
    id_proveedor INT,

    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor)
);


CREATE TRIGGER trg_detalle_compra_insert
BEFORE INSERT ON detalle_compra
FOR EACH ROW
BEGIN
    SET NEW.subtotal = NEW.cantidad * NEW.precio_compra;
END $$


CREATE TRIGGER trg_aumentar_stock
AFTER INSERT ON detalle_compra
FOR EACH ROW
BEGIN
    UPDATE productos
    SET stock = stock + NEW.cantidad
    WHERE id_producto = NEW.id_producto;
END $$

CREATE TRIGGER trg_total_compra
AFTER INSERT ON detalle_compra
FOR EACH ROW
BEGIN
    UPDATE compras
    SET total = (
        SELECT SUM(subtotal)
        FROM detalle_compra
        WHERE id_compra = NEW.id_compra
    )
    WHERE id_compra = NEW.id_compra;
END $$


CREATE TRIGGER trg_detalle_venta_insert
BEFORE INSERT ON detalle_venta
FOR EACH ROW
BEGIN
    SET NEW.subtotal = NEW.cantidad * NEW.precio_unitario;
END $$


CREATE TRIGGER trg_disminuir_stock
AFTER INSERT ON detalle_venta
FOR EACH ROW
BEGIN
    UPDATE productos
    SET stock = stock - NEW.cantidad
    WHERE id_producto = NEW.id_producto;
END $$



CREATE TRIGGER trg_total_venta
AFTER INSERT ON detalle_venta
FOR EACH ROW
BEGIN
    UPDATE ventas
    SET total = (
        SELECT SUM(subtotal)
        FROM detalle_venta
        WHERE id_venta = NEW.id_venta
    )
    WHERE id_venta = NEW.id_venta;
END $$



CREATE TRIGGER trg_validar_stock
BEFORE INSERT ON detalle_venta
FOR EACH ROW
BEGIN
    DECLARE stock_actual INT;

    SELECT stock INTO stock_actual
    FROM productos
    WHERE id_producto = NEW.id_producto;

    IF stock_actual < NEW.cantidad THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock insuficiente para realizar la venta';
    END IF;
END $$