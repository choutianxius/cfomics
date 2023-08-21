const assert = require('assert');
const handleQueryPromise = require('./handleQueryPromise');

const FIELDS = ['omics', 'subomics', 'dataset', 'element', 'cancer', 'specimen', 'value'];

/**
 *
 * @param {string | null} omics
 * @param {string | null} subomics
 * @param {string | null} dataset
 * @param {string | null} element
 * @param {string | null} cancer
 * @param {string | null} specimen
 * @param {string | null} value
 * @returns {Promise<Set<string>>} 所有可能表名
 */
async function findCancerTable (omics, subomics, dataset, element, cancer, specimen, value) {
  [omics, subomics, dataset, element, cancer, specimen, value].forEach((field, idx) => {
    if (field) {
      assert(typeof field === 'string', `${FIELDS[idx]} must be string, if not null`);
    }
  });
  const tableNamePattern = [omics, subomics, dataset, element, cancer, specimen, value].map((f) => (f || '%')).join('-');
  const query = `SELECT Table_name as name from information_schema.tables where table_schema = 'exOmics' and Table_name like '${tableNamePattern}';`;
  const rows = await handleQueryPromise(query, false);
  if (cancer === 'mean') {
    return rows.map((row) => row.name);
  }
  const rmMeanRows = rows.map((row) => {
    const { name } = row;
    if (name.includes('-mean-')) {
      return null;
    }
    return name;
  });
  return rmMeanRows.filter((v) => v !== null);
}

/**
 *
 * @param {string | null} omics
 * @param {string | null} subomics
 * @param {string | null} dataset
 * @param {string | null} element
 * @param {string | null} cancer
 * @param {string | null} specimen
 * @param {string | null} value
 * @param {string} toFind
 * @returns {Promise<Set<string>>} toFind域所有可能值
 */
async function findCancerTableField (
  omics,
  subomics,
  dataset,
  element,
  cancer,
  specimen,
  value,
  toFind,
) {
  assert(typeof toFind === 'string', 'Field name to be found must be string');
  const DATASET_FIELD_NAMES = ['omics', 'subomics', 'dataset', 'element', 'cancer', 'specimen', 'value'];
  const idx = DATASET_FIELD_NAMES.indexOf(toFind);
  assert(idx >= 0, 'Field name to be found must be one of omics, subomics, dataset, element, cancer, specimen or value');
  const tableNames = await findCancerTable(
    omics,
    subomics,
    dataset,
    element,
    cancer,
    specimen,
    value,
  );
  const fieldNames = tableNames.map((tn) => tn.split('-')[idx]);
  return new Set(fieldNames);
}

/**
 *
 * @param {string | null} omics
 * @param {string | null} subomics
 * @param {string | null} dataset
 * @param {string | null} element
 * @param {string | null} specimen
 * @param {string | null} value
 * @returns {Promise<Set<string>>} 所有可能表名
 */
function findMeanTable (omics, subomics, dataset, element, specimen, value) {
  return findCancerTable(omics, subomics, dataset, element, 'mean', specimen, value);
}

/**
 *
 * @param {string | null} omics
 * @param {string | null} subomics
 * @param {string | null} dataset
 * @param {string | null} element
 * @param {string | null} specimen
 * @param {string} toFind
 * @returns {Promise<Set<string>>} toFind域所有可能值
 */
function findMeanTableField (omics, subomics, dataset, element, specimen, value, toFind) {
  return findCancerTableField(omics, subomics, dataset, element, 'mean', specimen, value, toFind);
}

module.exports = { findCancerTable, findMeanTable, findCancerTableField, findMeanTableField };
