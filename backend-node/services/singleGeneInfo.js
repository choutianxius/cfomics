const assert = require('assert');
const handleQueryPromise = require('./handleQueryPromise');

/**
 * @param {string} ensemblGeneId
 * @returns {Promise<object>} gene_index表内对应行的期约
 */
async function singleGeneInfo (ensemblGeneId) {
  assert(typeof ensemblGeneId === 'string', 'ensemblGeneId Id must be string');
  const query = `select * from \`gene_index\` where ensembl_gene_id = "${ensemblGeneId}";`;
  const rows = await handleQueryPromise(query, false);
  return rows[0];
}

module.exports = singleGeneInfo;
