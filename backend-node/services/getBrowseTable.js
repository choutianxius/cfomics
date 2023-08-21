const assert = require('assert');
const handleQueryPromise = require('./handleQueryPromise');
const capitalize = require('./capitalize');

/**
 * 查询特定表格的特定范围的行，表格按特定列排序
 *
 * @param {string} omics
 * @param {string} subomics
 * @param {string} dataset
 * @param {string} element
 * @param {string} specimen
 * @param {string} value
 * @param {string | null} by
 * @param {Array<string> | null} list
 * @param {string | null} sortBy
 * @param {string | null} sortDirection
 * @param {number} firstRow 第一行序号，0起始
 * @param {number} rowsPerPage 每页行数，大于等于1
 * @returns {Promise<Array<object>>} 查询结果期约
 * @throws 如果参数有误
 */
function getBrowseTable (
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
) {
  [omics, subomics, dataset, element, specimen, value].forEach((field) => {
    assert(typeof field === 'string', 'Table name field must be string');
  });
  if (by !== null) {
    assert(typeof by === 'string', 'Column name to be searched by must be string');
    assert(by !== '', 'Column name to be searched should not be empty');
    assert(list !== null && list.length !== 0, 'Meaningless list if the column to be searched is empty');
    list.forEach((x) => {
      assert(typeof x === 'string', 'Names to be found must be strings');
    });
  }
  if (sortBy && sortDirection) {
    assert(typeof sortBy === 'string', 'Name of the column to be sorted by must be string');
    assert(typeof sortDirection === 'string', 'Name of sorting direction must be string');
    assert(['desc', 'asc'].includes(sortDirection), 'Name of sorting direction must be desc or asc');
  }
  assert(typeof firstRow === 'number', 'First row index must be number');
  assert(firstRow >= 0, 'First row index cannot be negative');
  assert(typeof rowsPerPage === 'number', 'Rows per page must be number');
  assert(rowsPerPage > 0, 'Rows per page must be positive');

  const tableName = [omics, subomics, dataset, element, 'mean', specimen, value].join('-');
  let andRowsIn = '';
  if (by && list) {
    const listSql = '(' + list.map((s) => `"${s}"`).join(',') + ')';
    andRowsIn = ` and ${by} in ${listSql}`;
  }
  let andOrderBy = '';
  if (sortBy && sortDirection) {
    andOrderBy = ` order by ${sortBy} ${sortDirection}`;
  }
  const andLimit = ` limit ${firstRow},${rowsPerPage}`;
  let query = '';
  if (omics === 'cfdna' && element === 'cgi') {
    // 通过基因名或id查询相关cgi
    query = `SELECT \`gene_index\`.ensembl_gene_id, \`gene_index\`.hgnc_symbol, \`cgi_index\`.*, \`${tableName}\`.* FROM \`gene_index\`, \`cgi_index\`, \`${tableName}\`, \`cgi_in_gene\` WHERE \`cgi_index\`.Cgi_ID = \`${tableName}\`.feature and \`cgi_in_gene\`.Cgi_ID = \`cgi_index\`.Cgi_ID and \`cgi_in_gene\`.Promoter_Gene_ID = \`gene_index\`.Promoter_Gene_ID and \`cgi_index\`.Cgi_ID in (select Cgi_ID from \`cgi_in_gene\`)`;
  } else if (omics === 'cfdna' && element === 'gene') {
    query = `SELECT \`${element}_index\`.*, \`${tableName}\`.* FROM \`${element}_index\`, \`${tableName}\` WHERE \`${element}_index\`.${capitalize(element)}_ID = \`${tableName}\`.feature`;
  } else if (omics === 'cfrna' && element === 'gene') {
    query = `SELECT \`${element}_index\`.*, \`${tableName}\`.* FROM \`${element}_index\`, \`${tableName}\` WHERE \`${element}_index\`.ensembl_gene_id = \`${tableName}\`.feature`;
  } else {
    query = `SELECT \`${tableName}\`.* FROM \`${tableName}\``;
  }

  [andRowsIn, andOrderBy, andLimit].forEach((s) => {
    query += s;
  });
  query += ';';

  return handleQueryPromise(query, false);
}

module.exports = getBrowseTable;
