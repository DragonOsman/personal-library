import mysql from "mysql2/promise";

const connection = mysql.createConnection({
  host: process.env.NODE_ENV === "production" ?
    process.env.DB_HOST_PROD :
    process.env.DB_HOST_DEV
  ,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

export default connection;