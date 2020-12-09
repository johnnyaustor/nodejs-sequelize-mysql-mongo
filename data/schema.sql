CREATE TABLE node_crud.products (
	id INT auto_increment NOT NULL,
	title varchar(100) NOT NULL,
	price DECIMAL NOT NULL,
	description TEXT NULL,
	image_url varchar(255) NULL,
	CONSTRAINT products_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;
