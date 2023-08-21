const assert = require('assert');
const handleQueryPromise = require('./handleQueryPromise');
const capitalize = require('./capitalize');

/**
 *
 * @param {string} omics
 * @param {string} subomics
 * @param {string} dataset
 * @param {string} element
 * @param {string} specimen
 * @param {string} value
 * @param {string | null} by
 * @param {Array<string> | null} list
 * @returns 目标表格包含行数的对象
 * @throws 如果参数有误，或数据库中无目标表格
 */
function getBrowseTableTotalRowNumber (
  omics,
  subomics,
  dataset,
  element,
  specimen,
  value,
  by,
  list,
) {
  [omics, subomics, dataset, element, specimen, value].forEach((x) => {
    assert(typeof x === 'string', `Table name field must be string, reading ${x}`);
  });
  if (by !== null) {
    assert(typeof by === 'string', 'Column name to be searched by must be string');
    assert(by !== '', 'Column name to be searched should not be empty');
    assert(list !== null && list.length !== 0, 'Meaningless list if the column to be searched is empty');
    list.forEach((x) => {
      assert(typeof x === 'string', 'Names to be found must be strings');
    });
  }

  const tableName = [omics, subomics, dataset, element, 'mean', specimen, value].join('-');
  let andRowsIn = '';
  if (by && list) {
    const listSql = '(' + list.map((s) => `"${s}"`).join(',') + ')';
    andRowsIn = ` and ${by} in ${listSql}`;
  }
  let query = '';
  if (omics === 'cfdna' && element === 'cgi') {
    // 通过基因名或id查询相关cgi
    query = `SELECT count(*) FROM \`gene_index\`, \`cgi_index\`, \`${tableName}\`, \`cgi_in_gene\` WHERE \`cgi_index\`.Cgi_ID = \`${tableName}\`.feature and \`cgi_in_gene\`.Cgi_ID = \`cgi_index\`.Cgi_ID and \`cgi_in_gene\`.Promoter_Gene_ID = \`gene_index\`.Promoter_Gene_ID and \`cgi_index\`.Cgi_ID in (select Cgi_ID from \`cgi_in_gene\`)`;
  } else if (omics === 'cfdna' && element === 'gene') {
    query = `SELECT count(*) FROM \`${element}_index\`, \`${tableName}\` WHERE \`${element}_index\`.${capitalize(element)}_ID = \`${tableName}\`.feature`;
  } else if (omics === 'cfrna' && element === 'gene') {
    query = `SELECT count(*) FROM \`${element}_index\`, \`${tableName}\` WHERE \`${element}_index\`.ensembl_gene_id = \`${tableName}\`.feature`;
  } else {
    query = `SELECT count(*) FROM \`${tableName}\``;
  }
  query += andRowsIn + ';';

  return handleQueryPromise(query, false);
}

module.exports = getBrowseTableTotalRowNumber;
