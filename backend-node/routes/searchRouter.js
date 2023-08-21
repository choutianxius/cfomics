/* eslint-disable no-console */

const router = require('express').Router();
const performSearch = require('../services/performSearch');

router.get('/performSearch', async (req, res) => {
  try {
    let { type, query, firstRow, rowsPerPage } = req.query;
    type = String(type).toLowerCase();
    query = String(query).toUpperCase();
    firstRow = Number(firstRow);
    rowsPerPage = Number(rowsPerPage);
    const data = await performSearch(type, query, firstRow, rowsPerPage);
    res.status(200).json(data).end();
  } catch (e) {
    res.status(400).end();
    console.log(e);
  }
});

module.exports = router;
