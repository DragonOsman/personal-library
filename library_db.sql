CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) NOT NULL PRIMARY KEY,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  passwordEnabled BOOLEAN,
  primaryEmailAddress VARCHAR(255),
  emailAddresses JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  libraryId VARCHAR(255),
  externalAccounts JSON,
  verifiedExternalAccounts JSON,
  web3Wallets JSON,
  primaryWeb3Wallet JSON,
  FOREIGN KEY (library_id) REFERENCES library(id)
);

CREATE TABLE IF NOT EXISTS library (
  id VARCHAR(255) NOT NULL PRIMARY KEY,
  user_id VARCHAR(255),
  books JSON,
  FOREIGN KEY (user_id) REFERENCES user(id),
);