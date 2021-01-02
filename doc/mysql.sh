create database fish;
CREATE USER 'fisher'@'localhost' IDENTIFIED WITH mysql_native_password BY 'fish';
GRANT ALL ON fish.* TO 'fisher'@'localhost';
FLUSH PRIVILEGES;

