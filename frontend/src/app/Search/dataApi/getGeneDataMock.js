/* eslint-disable no-unused-vars */
import bar from './images/bar.png';
import boxUnstacked from './images/boxUnstacked.png';
import boxStacked from './images/boxStacked.png';
import heatMap from './images/heatMap.png';

const kitten = 'http://placekitten.com/300/200';

export function getCancers (gene, omics, feature, dataset, specimen) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['CT', 'LIHC']);
    }, Math.floor(Math.random() * 1000));
  });
}

export function parseTable (table) {
  /**
   * Structure of table is as follows:
   * {
   *   dataset1: { k1: v1, k2: v2, k3: v3, ... },
   *   dataset2: { k1: v1, k2: v2, k3: v3, ... },
   *   ...
   * }
   */
  const rows0 = Object.entries(table);
  const rows = rows0.map((r) => {
    const dataset = r[0]; // "SRR1982609"
    const rowContent = r[1]; // { col1: v1, col2: v2, ... }
    return ({
      Dataset: dataset,
      ...rowContent,
    });
  });
  const colNames = ['Dataset'].concat(Object.keys(rows0[0][1]));
  return { rows, colNames };
}

export function getBarPlot (gene, omics, feature, dataset, specimen, cancer) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        image: bar,
        table: {
          SRR123456: { k1: Math.random() * 100, k2: Math.random() * 100, k3: Math.random() * 100 },
          SRR123457: { k1: Math.random() * 100, k2: Math.random() * 100, k3: Math.random() * 100 },
        },
      });
    }, Math.floor(Math.random() * 1000));
  });
}

export function getStackedBoxPlot (gene, omics, feature, dataset, specimen) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(boxStacked);
    }, Math.floor(Math.random() * 1000));
  });
}

export function getNonStackedBoxPlot (gene, omics, feature, dataset, specimen) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(boxUnstacked);
    }, Math.floor(Math.random() * 1000));
  });
}

export function getHeatMap (gene, omics, feature, dataset, specimen) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(heatMap);
    }, Math.floor(Math.random() * 1000));
  });
}

export function getEntity (gene, omics, feature, dataset, specimen) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(kitten);
    }, Math.floor(Math.random() * 1000));
  });
}

export function getComparisonAnentities (gene, omics, feature, datset, specimen, entity) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        'SE|ENSG123456|XXX',
        'GE|ENSG121344|YYY',
      ]);
    }, Math.floor(Math.random() * 1000));
  });
}

export function getComparison (gene, omics, feature, dataset, specimen, entity) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(kitten);
    }, Math.floor(Math.random() * 1000));
  });
}

export function getEndmotifComparison (motif, dataset, specimen) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(kitten);
    }, Math.floor(Math.random() * 1000));
  });
}

export function getMicrobeComparison (motif, dataset, specimen) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(kitten);
    }, Math.floor(Math.random() * 1000));
  });
}
