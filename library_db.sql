CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- schema.sql
CREATE TABLE "User" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  image TEXT
);

CREATE TABLE "Account" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  "refreshToken" TEXT,
  "accessToken" TEXT,
  "expiresAt" INTEGER,
  "tokenType" VARCHAR(255),
  scope TEXT,
  "idToken" TEXT,
  "sessionState" TEXT,

  CONSTRAINT fk_user FOREIGN KEY("userId") REFERENCES "User"(id) ON DELETE CASCADE,
  CONSTRAINT account_provider UNIQUE (provider, "providerAccountId")
);

CREATE TABLE "Session" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "sessionToken" VARCHAR(255) UNIQUE NOT NULL,
  "userId" UUID NOT NULL,
  expires TIMESTAMPTZ NOT NULL,

  CONSTRAINT fk_session_user FOREIGN KEY("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE TABLE "Library" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  name VARCHAR(255) NOT NULL,

  CONSTRAINT fk_library_user FOREIGN KEY("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE TABLE "Book" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  "libraryId" UUID NOT NULL,

  CONSTRAINT fk_book_library FOREIGN KEY("libraryId") REFERENCES "Library"(id) ON DELETE CASCADE
);

CREATE TABLE "VerificationToken" (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires TIMESTAMPTZ NOT NULL,

  PRIMARY KEY (identifier, token)
);
