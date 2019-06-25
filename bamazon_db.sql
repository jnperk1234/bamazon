USE bamazon_db

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT, 
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY(id)
);

INSERT INTO products (product_name, department_name,price, stock_quantity)
VALUES 
("Nintendo Switch", "Electronics", 299.99, 7),
("Playstation 4", "Electronics", 2399.99, 5),
("Xbox one", "Electronics", 399.99, 10),
("55in Samsung 4K TV", "Electronics", 299.99, 4),
("Bamazon Flame Player", "Electronics", 99.99, 15),
("Crock Pot", "Kitchen", 39.99, 13),
("Rice Cooker", "Kitchen", 19.99, 7),
("Purple Plate Set", "Kitchen", 49.99, 5),
("Pitcher", "Kitchen", 9.99, 11),
("Silverware", "Kitchen", 19.99, 8),
("Hair Dryer", "Hair and Beauty", 25.99, 17),
("Hair Brush", "Hair and Beauty", 5.99, 30),
("Flat iron", "Hair and Beauty", 59.99, 20),
("Comb Set", "Hair and Beauty", 8.99, 19),
("Shampoo", "Hair and Beauty", 11.99, 14),
("One Piece Manga Vol 75", "Books and Comics", 9.99, 8),
("My Hero Academia Vol 4", "Books and Comics", 9.99, 5),
("Saga Compilation vol 3", "Books and Comics", 19.99, 8),
("The Avengers Issue #117", "Books and Comics", 3.99, 11),
("Attack on Titan Vol 22", "Books and Comics", 10.99, 8)

