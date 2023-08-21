const assert = require('assert');
const capitalize = require('./capitalize');

/**
 *
 * @param {string} omics
 * @param {string} subomics
 * @param {string} dataset
 * @param {string} element
 * @param {string} cancer
 * @param {string} specimen
 * @param {string} value
 * @param {string | null} by
 * @param {Array<string> | null} list
 */
function mean (omics, subomics, dataset, element, cancer, specimen, value, by, list) {
  [omics, subomics, dataset, element, cancer, specimen, value].forEach((x) => {
    assert(typeof x === 'string', 'Table name field must be string');
  });
  if (by !== null) {
    assert(typeof by === 'string', 'Column name to be searched by must be string');
    assert(by !== '', 'Column name to be searched should not be empty');
    assert(list !== null && list.length !== 0, 'Meaningless list if the column to be searched is empty');
    list.forEach((x) => {
      assert(typeof x === 'string', 'Names to be found must be strings');
    });
  }
  const tableName = [omics, subomics, dataset, element, cancer, specimen, value].join('-');
  let andRowsIn = '';
  if (by && list) {
    const listSql = `(${list.map((s) => `"${s}"`).join(',')})`;
    andRowsIn = ` and ${by} in ${listSql}`;
  }
  let query;
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
  query += andRowsIn;
  query += ';';

  return query;
}

function general (omics, subomics, dataset, element, cancer, specimen, value, by, list) {
  [omics, subomics, dataset, element, cancer, specimen, value].forEach((x) => {
    assert(typeof x === 'string', 'Table name field must be string');
  });
  if (by !== null) {
    assert(typeof by === 'string', 'Column name to be searched by must be string');
    assert(by !== '', 'Column name to be searched should not be empty');
    assert(list !== null && list.length !== 0, 'Meaningless list if the column to be searched is empty');
    list.forEach((x) => {
      assert(typeof x === 'string', 'Names to be found must be strings');
    });
  }
  const tableName = [omics, subomics, dataset, element, cancer, specimen, value].join('-');
  let andRowsIn = '';
  if (by && list) {
    const listSql = `(${list.map((s) => `"${s}"`).join(',')})`;
    andRowsIn = ` and ${by} in ${listSql}`;
  }
  let query = `SELECT \`${tableName}\`.* FROM \`${tableName}\``;
  query += andRowsIn;
  query += ';';

  return query;
}

module.exports = { mean, general };
