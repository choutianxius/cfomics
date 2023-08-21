const fs = require('fs');
const { findCancerTable } = require('./findTable');
const MyNode = require('../utils/SelectionTree/MyNode');
const MyTree = require('../utils/SelectionTree/MyTree');
const { serialize } = require('../utils/SelectionTree/serialize');

/**
 *
 * @param {string} type
 * @param {Array<string>} tables
 */
function getAnalysisSelectOptionsFromTables (type, tables) {
  if (type === 'gene') {
    const root = new MyNode('*');
    const tree = new MyTree(root);
    let node = null;
    tables.forEach((t) => {
      const [omics, subomics, dataset, element, cancerIgnored, specimen, valueIgnored] = t.split('-');
      if (omics === 'met') { return; }
      if (subomics === 'microbe' || subomics === 'endmotif') {
        return;
      }
      if (subomics === 'te') { return; }
      if (['cgi', 'bin'].includes(element)) { return; }

      node = root;
      if (!node.children.find((x) => x.value === omics)) {
        node.children.push(new MyNode(omics));
      }

      node = node.children.find((x) => x.value === omics);
      if (!node.children.find((x) => x.value === subomics)) {
        node.children.push(new MyNode(subomics));
      }

      node = node.children.find((x) => x.value === subomics);
      if (!node.children.find((x) => x.value === dataset)) {
        node.children.push(new MyNode(dataset));
      }

      node = node.children.find((x) => x.value === dataset);
      if (!node.children.find((x) => x.value === specimen)) {
        node.children.push(new MyNode(specimen));
      }

      node = node.children.find((x) => x.value === specimen);
      if (!node.children.find((x) => x.value === element)) {
        node.children.push(new MyNode(element));
      }

      node = node.children.find((x) => x.value === element);
      node.children.push(new MyNode(t));
    });
    return serialize(tree);
  }

  if (type === 'microbe') {
    const root = new MyNode('*');
    const tree = new MyTree(root);
    let node = null;
    tables.forEach((t) => {
      const [omics, subomics, dataset, elementIgnored, meanIgnored, specimen, valueIgnored] = t.split('-');
      if (subomics !== 'microbe') {
        return;
      }

      node = root;
      if (!node.children.find((x) => x.value === omics)) {
        node.children.push(new MyNode(omics));
      }

      node = node.children.find((x) => x.value === omics);
      if (!node.children.find((x) => x.value === dataset)) {
        node.children.push(new MyNode(dataset));
      }

      node = node.children.find((x) => x.value === dataset);
      if (!node.children.find((x) => x.value === specimen)) {
        node.children.push(new MyNode(specimen));
      }

      node = node.children.find((x) => x.value === specimen);
      node.children.push(new MyNode(t));
    });
    return serialize(tree);
  }

  if (type === 'endmotif') {
    const root = new MyNode('*');
    const tree = new MyTree(root);
    let node = null;
    tables.forEach((t) => {
      const [subomics, dataset, elementIgnored, meanIgnored, specimen, valueIgnored] = t.split('-').slice(1);
      if (subomics !== 'endmotif') {
        return;
      }

      node = root;
      if (!node.children.find((x) => x.value === dataset)) {
        node.children.push(new MyNode(dataset));
      }

      node = node.children.find((x) => x.value === dataset);
      if (!node.children.find((x) => x.value === specimen)) {
        node.children.push(new MyNode(specimen));
      }

      node = node.children.find((x) => x.value === specimen);
      node.children.push(new MyNode(t));
    });
    return serialize(tree);
  }

  throw Error(`Invalid type: ${type}`);
}

async function getAnalysisSelectOptions (type) {
  let tables;
  if (type === 'gene') {
    tables = await findCancerTable();
  }
  if (type === 'endmotif' || type === 'microbe') {
    tables = await findCancerTable(null, type);
  }
  return getAnalysisSelectOptionsFromTables(type, tables);
}

// function test1 () {
//   const testNames = [
//     'cfdna-bsseq-gse124600-cgi-crc-plasma-beta',
//     'cfdna-bsseq-gse124600-cgi-ct-plasma-beta',
//     'cfdna-bsseq-gse149438-cgi-escc-plasma-beta',
//     'cfdna-bsseq-gse149438-promoter-escc-plasma-beta',
//     'cfdna-dipseq-gse113386-gene-cll-blood-tpm_5mc',
//     'cfdna-no-gse81314-15t5-luca-plasma-noratio',
//   ];
//   const data = getAnalysisSelectOptionsFromTables('gene', testNames);
//   console.log(JSON.stringify(data, null, 2));
// }

// async function test2 () {
//   getAnalysisSelectOptions('microbe')
//     .then((data) => { console.log(JSON.stringify(data, null, 2)); });
// }

// if (require.main === module) {
//   console.log('test1');
//   test1();
//   console.log('test2');
//   test2();
// }

if (require.main === module) {
  ['gene', 'microbe', 'endmotif'].forEach((type) => {
    getAnalysisSelectOptions(type)
      .then((data) => {
        fs.writeFileSync(
          // path is relative to where you use node
          `./write/${type}Options.json`,
          JSON.stringify(data),
        );
      });
  });
}

module.exports = getAnalysisSelectOptions;
