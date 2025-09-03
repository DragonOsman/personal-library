CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  "fullName" VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  "emailVerified" TIMESTAMPTZ(6),
  image TEXT,
  "avatarSource" VARCHAR(50),
  "hashedPassword" VARCHAR(255),
  "createdAt" TIMESTAMPTZ(6) DEFAULT now(),
  "updatedAt" TIMESTAMPTZ(6) DEFAULT now(),
  role VARCHAR(50) DEFAULT 'USER'
);

CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  providerAccountId VARCHAR(255) NOT NULL,
  refreshToken TEXT,
  accessToken TEXT,
  expiresAt INTEGER,
  tokenType VARCHAR(50),
  scope VARCHAR(255),
  idToken TEXT,
  sessionState VARCHAR(255),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (provider, providerAccountId)
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sessionToken VARCHAR(255) UNIQUE NOT NULL,
  userId VARCHAR(255) NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS verificationTokens (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

CREATE TABLE IF NOT EXISTS libraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId VARCHAR(255) UNIQUE,
  books JSONB,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);