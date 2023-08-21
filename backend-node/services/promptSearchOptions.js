const assert = require('assert');
const handleQueryPromise = require('./handleQueryPromise');

/**
 *
 * @param {string} inputType 'gene'或'cancer'等，指示输入内容类型
 * @param {Array<string>} inputContent 用户输入内容
 * @param {number} firstRow
 * @param {number} rowsPerPage
 * @returns {Promise<Array>} index表中相关行
 * @throws 如果inputType或input不合法
 */
async function promptSearchOptions (inputType, inputContent, firstRow, rowsPerPage) {
  assert(typeof inputType === 'string', 'Input type must be string');
  assert(typeof inputContent === 'string', 'Input must be string');

  assert(typeof firstRow === 'number', 'First row index must be number');
  assert(firstRow >= 0, 'First row index cannot be negative');
  assert(typeof rowsPerPage === 'number', 'Rows per page must be number');
  assert(rowsPerPage > 0, 'Rows per page must be positive');
  const andLimit = ` limit ${firstRow},${rowsPerPage}`;
  let query;
  if (inputType === 'gene') {
    query = `select hgnc_symbol,ensembl_gene_id from gene_index where hgnc_symbol like '${inputContent}%' or ensembl_gene_id like '${inputContent}%';`;
    query += andLimit;
    query += ';';
  } else {
    throw new Error('Received invalid or unimplemented inputType string');
  }

  return handleQueryPromise(query, false);
}

module.exports = promptSearchOptions;
