const assert = require('assert');
const mysql = require('mysql2');
const dbConfig = require('../config').mysql;

/**
 * 通用功能，，利用mysql2期约模块，执行query语句，返回查找结果
 *
 * @param {string} query 完整的可执行query语句
 * @param {boolean} rowsAsArray 控制查询结果的每一行是否为Array格式
 * @returns {Promise<Array<object>>} 查询结果
 * @throws 如果查不到结果，或参数有误
 */
async function handleQueryPromise (query, rowsAsArray = false) {
  assert(typeof query === 'string', 'Type of sql query must be string');
  assert(typeof rowsAsArray === 'boolean', 'Type of keyword rowsAsArray must be boolean');
  const connection = mysql.createConnection(dbConfig);
  try {
    const [rows, fieldsIgnored] = await connection.promise().query({ sql: query, rowsAsArray });
    return rows;
  } catch (e) {
    throw new Error('Query error');
  } finally {
    connection.end();
  }
}

module.exports = handleQueryPromise;
