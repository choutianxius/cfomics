const assert = require('assert');
const handleQueryPromise = require('./handleQueryPromise');
const { findCancerTable } = require('./findTable');

/**
 *
 * @param {string} omics
 * @param {string} subomics
 * @param {string} element
 * @param {string} specimen
 * @param {string} value
 * @param {string} id
 * @returns {Promise<Array<object>>}
 */
async function exprPlotAcrossCancers (omics, subomics, element, specimen, value, id) {
  [omics, subomics, element, specimen, value, id].forEach((x) => {
    assert(typeof x === 'string', 'Field name must be string');
  });
  const tableNames = await findCancerTable(omics, subomics, null, element, null, specimen, value);
  const data = {};
  tableNames.forEach(async (tn) => {
    const query = `select * from \`${tn}\` where feature = "${id}";`;
    let rows;
    try {
      const rows0 = await handleQueryPromise(query, true);
      if (!rows0) {
        // 表内无该实体
        rows = [[]];
      } else if (rows0.length === 0) {
        // 表内无该实体
        rows = [[]];
      } else {
        rows = rows0;
      }
    } catch (e) {
      // 表内无该实体
      rows = [[]];
    }
    // 第一列是feature名，所以slice(1)
    const row = rows[0].slice(1).map((v) => parseFloat(v));
    const cancer = tn.split('-')[4];
    if (!(cancer in data)) {
      data[cancer] = row;
    } else {
      const updatedRow = data[cancer].concat(row);
      data[cancer] = updatedRow;
    }
  });
  return data;
}

module.exports = exprPlotAcrossCancers;
