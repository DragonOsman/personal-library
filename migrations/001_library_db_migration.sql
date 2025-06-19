CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  fullName VARCHAR(255),
  passwordEnabled BOOLEAN,
  primaryEmailAddress VARCHAR(255),
  emailAddresses JSONB,
  createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  externalAccounts JSONB,
  verifiedExternalAccounts JSONB,
  web3Wallets JSONB,
  primaryWeb3Wallet JSONB
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = NOW();
  RETURN NEW;
END;
$$ language "plpgsql";

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS libraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId VARCHAR(255) UNIQUE,
  books JSONB,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);