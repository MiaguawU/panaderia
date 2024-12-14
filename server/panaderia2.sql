-- Crear la tabla Temporada
CREATE TABLE Temporada (
    id_temporada SERIAL PRIMARY KEY,
    temporada VARCHAR(100) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_termino DATE NOT NULL
);

-- Crear la tabla Producto
CREATE TABLE Producto (
    id_producto SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(50) NOT NULL,
    precio NUMERIC(10, 2) NOT NULL CHECK (precio > 0),
    descripcion VARCHAR(250),
    piezas INT NOT NULL CHECK (piezas >= 0),
    imagen_url TEXT,
    id_temporada INT NOT NULL,
    FOREIGN KEY (id_temporada) REFERENCES Temporada(id_temporada)
);

-- Crear la tabla Roles
CREATE TABLE Roles (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL
);

-- Insertar roles
INSERT INTO Roles (nombre_rol) VALUES
('admin'),
('cliente');

-- Crear la tabla Usuarios
CREATE TABLE Usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(100) UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    imagen TEXT NOT NULL,
    fondos NUMERIC(13, 2) DEFAULT 0 CHECK (fondos BETWEEN 0 AND 999999999999),
    FOREIGN KEY (id_rol) REFERENCES Roles(id_rol)
);

-- Insertar usuario
INSERT INTO Usuarios (nombre_usuario, correo, contrasena, id_rol, imagen) VALUES
('isis', 'isis.miaguaw@gmail.com', 'ch0pp3r', 1, 'https://i.pinimg.com/736x/ea/55/a7/ea55a756b236f936d4e9f2b8c356bdaf.jpg');

-- Crear la tabla Carritos
CREATE TABLE Carritos (
    id_carrito SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

-- Crear la tabla Carrito_Productos
CREATE TABLE Carrito_Productos (
    id_carrito_producto SERIAL PRIMARY KEY,
    id_carrito INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    FOREIGN KEY (id_carrito) REFERENCES Carritos(id_carrito),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);

-- Crear la tabla Compras
CREATE TABLE Compras (
    id_compra SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total NUMERIC(10, 2) NOT NULL CHECK (total > 0),
    numero_venta BIGINT UNIQUE NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

-- Crear la tabla Compra_Productos
CREATE TABLE Compra_Productos (
    id_compra_producto SERIAL PRIMARY KEY,
    id_compra INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(10, 2) NOT NULL,
    FOREIGN KEY (id_compra) REFERENCES Compras(id_compra),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);

-- Insertar datos en Temporada
INSERT INTO Temporada (temporada, fecha_inicio, fecha_termino) VALUES
('Todas', '2024-01-01', '2030-12-31'),
('Navidad', '2024-12-01', '2024-12-31'),
('Halloween', '2024-10-30', '2024-11-10');

-- Procedimiento para crear una compra
CREATE OR REPLACE FUNCTION CrearCompra(
    id_carrito_input INT,
    id_usuario_input INT
) RETURNS INT AS $$
DECLARE
    total NUMERIC(10, 2);
    id_compra_output INT;
BEGIN
    -- Calcular el total del carrito
    SELECT SUM(p.precio * c.cantidad)
    INTO total
    FROM carrito_productos c
    JOIN producto p ON p.id_producto = c.id_producto
    WHERE c.id_carrito = id_carrito_input;

    -- Crear la compra
    INSERT INTO Compras (id_usuario, total, numero_venta)
    VALUES (id_usuario_input, total, FLOOR(RANDOM() * 1000000000))
    RETURNING id_compra INTO id_compra_output;

    -- Transferir productos del carrito a Compra_Productos
    INSERT INTO Compra_Productos (id_compra, id_producto, cantidad, precio_unitario)
    SELECT 
        id_compra_output,
        c.id_producto,
        c.cantidad,
        p.precio
    FROM carrito_productos c
    JOIN producto p ON p.id_producto = c.id_producto
    WHERE c.id_carrito = id_carrito_input;

    -- Limpiar el carrito
    DELETE FROM carrito_productos WHERE id_carrito = id_carrito_input;

    RETURN id_compra_output;
END;
$$ LANGUAGE plpgsql;

-- Procedimiento para eliminar un usuario
CREATE OR REPLACE FUNCTION EliminarUsuario(id_usuario_input INT) RETURNS VOID AS $$
BEGIN
    -- Eliminar referencias en Compra_Productos
    DELETE FROM Compra_Productos
    WHERE id_compra IN (
        SELECT id_compra FROM Compras WHERE id_usuario = id_usuario_input
    );

    -- Eliminar referencias en Compras
    DELETE FROM Compras WHERE id_usuario = id_usuario_input;

    -- Eliminar referencias en Carrito_Productos
    DELETE FROM Carrito_Productos
    WHERE id_carrito IN (
        SELECT id_carrito FROM Carritos WHERE id_usuario = id_usuario_input
    );

    -- Eliminar referencias en Carritos
    DELETE FROM Carritos WHERE id_usuario = id_usuario_input;

    -- Eliminar al usuario
    DELETE FROM Usuarios WHERE id_usuario = id_usuario_input;
END;
$$ LANGUAGE plpgsql;
