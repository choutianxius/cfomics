/* eslint-disable no-console */

const router = require('express').Router();
const { findMeanTable, findMeanTableField, findCancerTableField } = require('../services/findTable');
const handleQueryPromise = require('../services/handleQueryPromise');

router.post('/findMeanTableField', async (req, res) => {
  try {
    const { omics, subomics, dataset, element, specimen, value, toFind } = req.body;
    const result = await findMeanTableField(
      omics,
      subomics,
      dataset,
      element,
      specimen,
      value,
      toFind,
    );
    res.status(200).json({ values: Array.from(result) }).end();
  } catch (e) {
    res.status(400).end();
    console.log(e);
  }
});

router.post('/findCancerTableField', async (req, res) => {
  try {
    const { omics, subomics, dataset, element, cancer, specimen, value, toFind } = req.body;
    const result = await findCancerTableField(
      omics,
      subomics,
      dataset,
      element,
      cancer,
      specimen,
      value,
      toFind,
    );
    res.status(200).json({ values: Array.from(result) }).end();
  } catch (e) {
    res.status(400).end();
    console.log(e);
  }
});

// 这个方法使用期约链，非常有意思。请反复研究！
router.post('/getDatasetCols', async (req, res) => {
  try {
    const { omics, subomics, element, specimen, value } = req.body;
    findMeanTable(omics, subomics, null, element, specimen, value).then((tableNames) => {
      const data = [];
      const promises = tableNames.map(async (tn) => {
        const p = handleQueryPromise(`show columns from \`${tn}\`;`);
        const cancersSliceIdx = omics === 'pro' ? 2 : 1;
        const cancers = (await p).slice(cancersSliceIdx).map((entry) => entry.Field);
        const dataset = (tn.split('-'))[2];
        data.push({ dataset, cancers });
        return p;
      });
      Promise.all(promises).then(() => res.status(200).json(data).end());
    });
  } catch (e) {
    res
      .status(400)
      .json({ detail: e.message })
      .end();
    console.log(e);
  }
});

router.get('/getIgvOptions', async (req, res) => {
  try {
    const allIgvOptions = require('../static/dirFilesAll.json');
    res.status(200).json(allIgvOptions).end();
  } catch (e) {
    res.status(500).json({ detail: e.message }).end();
  }
});

module.exports = router;
