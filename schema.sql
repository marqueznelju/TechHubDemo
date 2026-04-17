-- Database Schema for Tech Hub
CREATE DATABASE tech_hub_db;
USE tech_hub_db;

-- Tables
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_qty INT DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE price_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    old_price DECIMAL(10, 2),
    new_price DECIMAL(10, 2),
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- The Discount Function (10% Off)
DELIMITER //
CREATE FUNCTION fn_ApplyFlashSale(price DECIMAL(10,2)) 
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    RETURN price * 0.90;
END //
DELIMITER ;

-- The Stock Alert Procedure
DELIMITER //
CREATE PROCEDURE sp_CheckLowStock(IN p_min_qty INT, OUT p_low_stock_count INT)
BEGIN
    SELECT COUNT(*) INTO p_low_stock_count 
    FROM products 
    WHERE stock_qty < p_min_qty;
END //
DELIMITER ;

-- The Audit Trigger
DELIMITER //
CREATE TRIGGER trg_PriceAudit
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    IF OLD.price <> NEW.price THEN
        INSERT INTO price_logs (product_id, old_price, new_price)
        VALUES (OLD.id, OLD.price, NEW.price);
    END IF;
END //
DELIMITER ;