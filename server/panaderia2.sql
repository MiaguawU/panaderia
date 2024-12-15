CREATE DATABASE IF NOT EXISTS panaderia2;

USE panaderia2; 


CREATE TABLE Temporada (
    id_temporada INT AUTO_INCREMENT PRIMARY KEY,
    temporada VARCHAR(100) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_termino DATE NOT NULL
);


CREATE TABLE Producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(50) NOT NULL,
    precio DOUBLE NOT NULL CHECK (precio > 0),
    descripcion VARCHAR(250),
    piezas INT NOT NULL CHECK (piezas >= 0),
    imagen_url LONGTEXT,
    id_temporada INT NOT NULL,
    FOREIGN KEY (id_temporada) REFERENCES Temporada(id_temporada)
);


CREATE TABLE Roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL
);

insert into roles (nombre_rol) values
('admin'),
('cliente');

CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(100) UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL ,
    imagen LONGTEXT not null ,
    fondos DECIMAL(13, 2) DEFAULT 0 CHECK (fondos BETWEEN 0 AND 999999999999),
    FOREIGN KEY (id_rol) REFERENCES Roles(id_rol)
);


insert into usuarios (nombre_usuario,correo,contrasena,id_rol,imagen) value ('isis', 'isis.miaguaw@gmail.com','ch0pp3r',1,'https://i.pinimg.com/736x/ea/55/a7/ea55a756b236f936d4e9f2b8c356bdaf.jpg');

CREATE TABLE Carritos (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);


CREATE TABLE Carrito_Productos (
    id_carrito_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_carrito INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    FOREIGN KEY (id_carrito) REFERENCES Carritos(id_carrito),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);


CREATE TABLE Compras (
    id_compra INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL CHECK (total > 0),
    numero_venta BIGINT UNIQUE NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);


CREATE TABLE Compra_Productos (
    id_compra_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_compra INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10, 2) NOT NULL,                               
    FOREIGN KEY (id_compra) REFERENCES Compras(id_compra),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);


insert into temporada(temporada, fecha_inicio, fecha_termino) values
('Todas','2024-01-01','2030-12-31'),
('Navidad','2024-12-01','2024-12-31'),
('Halloween','2024-10-30','2024-11-10');

INSERT INTO Producto (nombre_producto, precio, descripcion, piezas, imagen_url, id_temporada) VALUES
('Pan de Jengibre', 50.00, 'Pan dulce típico navideño', 100, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNpi_LSRNaAJPO_Ok78PsuLEuUOgZOmE6Grg&s', 2),
('Rosca de Reyes', 200.00, 'Rosca tradicional con fruta cristalizada', 50, 'https://www.cocinadelirante.com/800x600/filters:format(webp):quality(75)/sites/default/files/images/2021/01/rosca-de-reyes-con-chocolate.jpg', 1),
('Galletas de Calabaza', 30.00, 'Galletas con sabor a calabaza ideales para Halloween', 200, 'https://cocinarecetasgeniales.com/wp-content/uploads/2024/09/Divertidas-galletas-de-calabaza-para-Halloween-faciles-de-hacer-768x768.jpg', 3),
('Pan de Muerto', 45.00, 'Pan tradicional mexicano para Día de Muertos', 120, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdzf-6HGJh1KVWbGyUxS8XlQIVpM_Hf9sJnxUunfInUU4kQOhC5uJism1vtZYln8yTMYo&usqp=CAU', 3),
('Bizcocho de Navidad', 75.00, 'Bizcocho esponjoso con especias navideñas', 80, 'https://i.ytimg.com/vi/NCHVLnnOqyI/maxresdefault.jpg', 2),
('Pan Integral', 25.00, 'Pan saludable con granos enteros', 150, 'https://i.blogs.es/1a1b83/copia-de-portada---2024-06-24t165356.841/450_1000.jpg', 1),
('Pan Francés', 35.00, 'Clásico pan francés con un toque de mantequilla', 90, 'https://i.blogs.es/c48793/pan-frances-en-freidora-de-aire-1-/1366_2000.jpg', 1),
('Brioche', 60.00, 'Pan dulce de origen francés con un sabor exquisito', 70, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoyP_7ClonmyXYeF5eQR4jm84gZVvI253IbA&s', 1),
('Pan de Chocolate', 55.00, 'Pan relleno de chocolate derretido', 60, 'https://camillelittlecookie.com/wp-content/uploads/2023/11/Copia-de-Captura-de-Pantalla-2023-11-07-a-las-14.24.03.png', 1),
('Donas de Navidad', 40.00, 'Donas decoradas con motivos navideños', 140, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3S4NjL4IsSmm-4_Kk2FqyN4uKqbQ7P-pBWQ&s', 2),
('Galletas de Fantasmas', 25.00, 'Galletas temáticas de Halloween', 180, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdZjTj8tMK0XuLF9JbgWwCRQYneL9PuxMnOw&s', 3),
('Muffins de Calabaza', 50.00, 'Muffins suaves con especias otoñales', 110, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXSz1aYRYIzCZbd8JEZNYtJlcunJLLp_sBPw&s', 3),
('Pan de Ajo', 20.00, 'Pan con un toque de ajo y perejil', 130, 'https://www.hola.com/horizon/landscape/72668ed70cfe-pan-mantequilla-adobe-t.jpg', 1),
('Tarta de Manzana', 90.00, 'Tarta casera con relleno de manzana', 40, 'https://mandolina.co/wp-content/uploads/2020/11/tarta-de-manzana.jpg', 1),
('Galletas de Nuez', 35.00, 'Galletas crujientes con trozos de nuez', 200, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoFmGee47I_X8w3bbz1e3sLLD6djb-unc4Tw&s', 1),
('Rollo de Canela', 50.00, 'Pan dulce enrollado con canela y azúcar', 100, 'https://www.lacocinadelila.com/wp-content/uploads/2014/03/cinnamon-rolls-o-rollos-de-canela--600x450.jpg', 1),
('Pan de Especias', 65.00, 'Pan navideño con una mezcla de especias', 90, 'https://imagenes.elpais.com/resizer/v2/JHMTMDR6A5DSLLMUUWE4ZY25EU.jpg?auth=e5063eee4bab8085718e3710569d6db1536f060007ac47a6c8b25a734f99e32f&width=1960&height=1470&smart=true', 2),
('Cupcakes de Halloween', 45.00, 'Cupcakes decorados con motivos de Halloween', 120, 'https://i.pinimg.com/736x/da/79/2c/da792cc65ba8ac9b5955bb16dd549324.jpg', 3),
('Croissant', 30.00, 'Pan en forma de media luna, perfecto para el desayuno', 150, 'https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/090583d58388048bb29f60626f704c8e/Derivates/8ca882703d8350ae1fd21616ac930be0c4d7e494.jpg', 1),
('Empanadas de Calabaza', 40.00, 'Empanadas rellenas de dulce de calabaza', 100, 'https://peopleenespanol.com/thmb/px5GarUe0rxAr66lKEaboMetCHM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1158987157-2000-25ff8f49b6af4027ac4a62eed28effd7.jpg', 3),
('Concha', 40.00, 'pan originario de Mexico', 100, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPBtVmdkfr1IbZj9mtahepOCoO9mW9usCl-wBKh9kaaeZtJWXVxrjMP10wL4IpivgBq8A&usqp=CAU', 1);


DELIMITER $$

CREATE PROCEDURE CrearCompra (
    IN id_carrito_input INT,
    IN id_usuario_input INT,
    OUT id_compra_output INT
)
BEGIN
    DECLARE total DECIMAL(10, 2);
    
    -- Calcular el total del carrito
    SELECT SUM(p.precio * c.cantidad)
    INTO total
    FROM carrito_productos c
    LEFT JOIN producto p ON p.id_producto = c.id_producto
    WHERE c.id_carrito = id_carrito_input;
    
    -- Crear la compra
    INSERT INTO Compras (id_usuario, total, numero_venta)
    VALUES (id_usuario_input, total, FLOOR(RAND() * 1000000000));

    -- Obtener el ID de la compra creada
    SET id_compra_output = LAST_INSERT_ID();
    
    -- Transferir productos del carrito a Compra_Productos
    INSERT INTO Compra_Productos (id_compra, id_producto, cantidad, precio_unitario)
    SELECT 
        id_compra_output,
        c.id_producto,
        c.cantidad,
        p.precio
    FROM carrito_productos c
    LEFT JOIN producto p ON p.id_producto = c.id_producto
    WHERE c.id_carrito = id_carrito_input;

    -- Limpiar el carrito
    DELETE FROM carrito_productos WHERE id_carrito = id_carrito_input;
END$$

DELIMITER ;

insert into carritos (id_usuario) values (1);

DELIMITER $$

CREATE PROCEDURE EliminarUsuario (IN id_usuario_input INT)
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

    -- Finalmente, eliminar al usuario
    DELETE FROM Usuarios WHERE id_usuario = id_usuario_input;
END$$

DELIMITER ;

