CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) NOT NULL PRIMARY KEY,
  user_id VARCHAR(255),
  library_id VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES Clerk(id),
  FOREIGN KEY (library_id) REFERENCES library(id)
);

CREATE TABLE IF NOT EXISTS library (
  id VARCHAR(255) NOT NULL PRIMARY KEY,
  user_id VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES user(id),
  books JSON
);