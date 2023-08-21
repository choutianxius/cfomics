/* eslint-disable no-console */
const router = require('express').Router();
const getBrowseSelectOptions = require('../services/getBrowseSelectOptions');
const getBrowseTableTotalRowNumber = require('../services/getBrowseTableTotalRowNumber');
const getBrowseTable = require('../services/getBrowseTable');

router.get('/getBrowseSelectOptions', async (req, res) => {
  try {
    const { omics } = req.query;
    const options = await getBrowseSelectOptions(omics);
    res.status(200).json(options).end();
  } catch (e) {
    res.status(400).end();
    console.log(e);
  }
});

router.post('/getBrowseTableTotalRowNumber', async (req, res) => {
  try {
    const { omics, subomics, dataset, element, specimen, value, by, list } = req.body;
    const rows = await getBrowseTableTotalRowNumber(
      omics,
      subomics,
      dataset,
      element,
      specimen,
      value,
      by,
      list,
    );
    const data = { totalRows: Object.values(rows[0])[0] };
    res.status(200).json(data).end();
  } catch (e) {
    res.status(400).end();
    console.log(e);
  }
});

router.post('/getBrowseTable', async (req, res) => {
  try {
    const {
      omics,
      subomics,
      dataset,
      element,
      specimen,
      value,
      by,
      list,
      sortBy,
      sortDirection,
      firstRow,
      rowsPerPage,
    } = req.body;
    const rows = await getBrowseTable(
      omics,
      subomics,
      dataset,
      element,
      specimen,
      value,
      by,
      list,
      sortBy,
      sortDirection,
      firstRow,
      rowsPerPage,
    );
    const data = { rows };
    res.status(200).json(data).end();
  } catch (e) {
    res.status(400).end();
    console.log(e);
  }
});

module.exports = router;
