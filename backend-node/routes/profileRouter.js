/* eslint-disable no-console */

const router = require('express').Router();
const singleGeneInfo = require('../services/singleGeneInfo');

router.get('/gene/:ensemblGeneId/generalInfo', async (req, res) => {
  try {
    const { ensemblGeneId } = req.params;
    const row = await singleGeneInfo(ensemblGeneId);
    res.status(200).json({ info: row }).end();
  } catch (e) {
    res.status(400).json({ detail: 'Unexpected error' }).end();
    console.log(e);
  }
});

module.exports = router;
