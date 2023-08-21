const assert = require('assert');
const handleQueryPromise = require('./handleQueryPromise');

/**
 *
 * @param {string} inputType 'gene'或'cancer'等，指示输入内容类型
 * @param {string} inputContent 用户输入内容
 * @param {number} firstRow
 * @param {number} rowsPerPage
 * @returns {Promise<Array<object>>} 相关实体index信息
 * @throws 如果target或input不合法
 */
async function performSearch (inputType, inputContent, firstRow, rowsPerPage) {
  assert(typeof inputType === 'string', 'Input type must be string');
  assert(typeof inputContent === 'string', 'Input content must be string');

  assert(typeof firstRow === 'number', 'First row index must be number');
  assert(firstRow >= 0, 'First row index cannot be negative');
  assert(typeof rowsPerPage === 'number', 'Rows per page must be number');
  assert(rowsPerPage > 0, 'Rows per page must be positive');
  const andLimit = ` limit ${firstRow},${rowsPerPage}`;

  if (inputType === 'gene') {
    const likes = ` hgnc_symbol LIKE '${inputContent}%' OR ensembl_gene_id like '${inputContent}%'`;
    let query = 'SELECT * from gene_index WHERE';
    query += likes;
    query += andLimit;
    query += ';';
    const options = await handleQueryPromise(query, false);

    let query1 = 'select count(*) from gene_index where';
    query1 += likes;
    query1 += ';';
    const totalCount = await handleQueryPromise(query1, false);
    return { options, totalCount: totalCount[0]['count(*)'] };
  }

  if (inputType === 'microbe') {
    const likes = ` feature like '%${inputContent}%'`;
    let query = 'select * from microbe_taxo where';
    query += likes;
    query += andLimit;
    query += ';';
    const options = await handleQueryPromise(query, false);

    let query1 = 'select count(*) from microbe_taxo where';
    query1 += likes;
    query1 += ';';
    const totalCount = await handleQueryPromise(query1, false);
    return { options, totalCount: totalCount[0]['count(*)'] };
  }

  throw new Error(`Invalid input type: ${inputType}`);
}

module.exports = performSearch;
