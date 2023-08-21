const { findCancerTable } = require('./findTable');

/**
 *
 * @param {string} omics
 */
async function getBrowseSelectOptions (omics) {
  const options = {};
  const tables = await findCancerTable(omics, null, null, null, null, null, null);
  let o = null;
  tables.forEach((t) => {
    const [subomics, datasetIgnored, element, meanIgnored, specimen, value] = t.split('-').slice(1);

    o = options;
    if (!Object.hasOwn(o, subomics)) {
      o[subomics] = {};
    }

    o = o[subomics];
    if (!Object.hasOwn(o, value)) {
      o[value] = {};
    }

    o = o[value];
    if (!Object.hasOwn(o, element)) {
      o[element] = {};
    }

    o = o[element];
    if (!Object.hasOwn(o, specimen)) {
      o[specimen] = {};
    }
  });
  return options;
}

module.exports = getBrowseSelectOptions;
