const assert = require('assert');
const mysql = require('mysql2');
const dbConfig = require('../config').mysql;

/**
 * 通用功能，执行query语句，之后执行回调函数，非期约版本
 *
 * @param {string} query query语句
 * @param {function} callback 回调函数，依次接收err, results, fields三个参数
 * @throws 如果查不到结果，或参数有误
 */
function handleQueryCallback (
  query,
  rowsAsArray = false,
  callback = (() => {}),
) {
  assert(typeof query === 'string', 'Type of sql query must be string');
  assert(typeof rowsAsArray === 'boolean', 'Type of keyword rowsAsArray must be boolean');
  assert(typeof callback === 'function', 'Type of callback function must be function');
  const connection = mysql.createConnection(dbConfig);
  try {
    connection.query({ sql: query, rowsAsArray }, (err, results, fields) => {
      if (err) {
        throw err;
      }
      callback(err, results, fields);
    });
  } finally {
    connection.end();
  }
}

module.exports = handleQueryCallback;
