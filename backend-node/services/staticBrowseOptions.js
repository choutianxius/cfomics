/**
 * Get browse options and write into file
 */

const fs = require('fs');
const getBrowseSelectOptions = require('./getBrowseSelectOptions');

function main () {
  const data = {};
  const omicses = ['cfdna', 'cfrna', 'pro', 'met'];
  const promises = omicses.map(async (omics) => {
    const optionsPromise = getBrowseSelectOptions(omics);
    data[omics] = await optionsPromise;
    return optionsPromise;
  });

  Promise.all(promises).then(() => {
    fs.writeFileSync(
      './write/browseOptions.json',
      JSON.stringify(data),
    );
  });
}

if (require.main === module) { main(); }
