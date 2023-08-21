/* eslint-disable no-console */

/**
 * 表格可能很大，几千行。考虑stream
 */
const router = require('express').Router();
const assert = require('assert');
const mysql = require('mysql2');
const dbConfig = require('../config').mysql;

const downloadBrowseTable = require('../services/downloadBrowseTable').mean;
const downloadBrowseTable1 = require('../services/downloadBrowseTable').general;
const findTable = require('../services/findTable').findCancerTable;

router.get('/mean', (req, res) => {
  const FORMATS = ['csv', 'json'];
  const connection = mysql.createConnection(dbConfig);
  try {
    const {
      format,
      omics,
      subomics,
      dataset,
      element,
      specimen,
      value,
      by,
      list,
    } = req.query;
    const by1 = by ? String(by) : null;
    const list1 = list ? list.trim().split(',').map((s) => s.trim().toUpperCase()) : null;
    let fileName = [omics, subomics, dataset, element, 'mean', specimen, value].join('-');
    if (by1 && list1) { fileName += '-search'; }
    const fileExtension = format === 'json' ? 'txt' : format;
    assert(typeof format === 'string', 'Format name must be string');
    assert(FORMATS.includes(format), 'Format must be csv or json');
    const query = downloadBrowseTable(omics, subomics, dataset, element, 'mean', specimen, value, by1, list1);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attach; filename="${fileName}.${fileExtension}"`);
    if (format === 'csv') {
      const stream = connection.query({
        sql: query,
        rowsAsArray: true,
      }).stream({ highWaterMark: 5 });
      stream.on('data', (chunk) => {
        const line = chunk.join(',') + '\n';
        res.write(line);
      });
      stream.on('end', () => { res.end(); }); // This line is necessary
    } else if (format === 'json') {
      const stream = connection.query({
        sql: query,
        rowsAsArray: false,
      }).stream({ highWaterMark: 5 });
      stream.on('data', (chunk) => {
        const line = JSON.stringify(chunk) + '\n';
        res.write(line);
      });
      stream.on('end', () => { res.end(); }); // This line is necessary
    } else {
      throw new Error('Unsupported file format');
    }
  } catch (e) {
    res.status(400).send('There is error in your selections. No result found.').end();
    console.log(e);
  } finally {
    connection.end();
  }
});

router.get('/', async (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  try {
    const { subomics, dataset, element, cancer, specimen, value } = req.query;
    const tableName = (await findTable(
      null,
      subomics,
      dataset,
      element,
      cancer,
      specimen,
      value,
    ))[0];
    const query = downloadBrowseTable1(...tableName.split('-'), null, null);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attach; filename="${tableName}.csv"`);
    const stream = connection.query({ sql: query, rowsAsArray: true }).stream({ highWaterMark: 5 });
    stream.on('data', (chunk) => {
      const line = chunk.join(',') + '\n';
      res.write(line);
    });
    stream.on('end', () => { res.end(); }); // This line is necessary
  } catch (e) {
    res.status(400).send('There is error in your selections. No result found.').end();
    console.log(e);
  } finally {
    connection.end();
  }
});

module.exports = router;
