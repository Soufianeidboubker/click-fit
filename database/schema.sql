-- Create database if not exists
CREATE DATABASE IF NOT EXISTS clickfit
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE clickfit;

-- Create users table
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    active TINYINT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create stored procedure (with conditional drop)
DROP PROCEDURE IF EXISTS addUser;
DELIMITER $$

CREATE PROCEDURE addUser(
    IN user_email VARCHAR(255),
    IN user_password VARCHAR(255),
    IN user_type VARCHAR(255)
)
BEGIN
    INSERT INTO users (email, password, type, active)
    VALUES (user_email, user_password, user_type, DEFAULT);
END$$

DELIMITER ;