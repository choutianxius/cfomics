require('dotenv').config();

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_DEFAULT,
  ALLOWED_HOST,
  LISTENING_PORT,
} = process.env;

exports.server = {
  host: ALLOWED_HOST,
  port: Number(LISTENING_PORT),
};

exports.mysql = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_DEFAULT,
};
