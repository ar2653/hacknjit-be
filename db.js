require("dotenv").config();
const mysql = require("mysql2");

// Creating a sql pool with db details

const sql = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000, // 20 seconds
});

module.exports = sql;

