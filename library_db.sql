CREATE DATABASE library_db;
USE library_db;

CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  synopsis VARCHAR(1000),
  isbn VARCHAR(13) UNIQUE NOT NULL,
  publication_date TIMESTAMP,
  reader_ids JSON
)