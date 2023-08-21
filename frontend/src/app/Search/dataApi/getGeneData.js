/* eslint-disable no-unused-vars */
import { plotUrl, serverListeningUrl } from '../../../config';
import NoDataError from '../../../utils/errors/NoDataError';
import encodeQueryParams from '../../../utils/encodeQueryParams';

export function getCancers (gene, omics, feature, dataset, specimen) {
  return fetch(serverListeningUrl + '/misc/findCancerTableField', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({
      omics,
      subomics: feature,
      dataset,
      element: null,
      cancer: null,
      specimen,
      value: null,
      toFind: 'cancer',
    }),
  })
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error('Unexpected error when getting the list of cancers.');
    })
    .then((resJson) => resJson.values); // { "values": ["ct_cld", "lihc"] }
}

export function parseTable (table, error = false) {
  /**
   * Structure of table is as follows:
   * {
   *   dataset1: { k1: v1, k2: v2, k3: v3, ... },
   *   dataset2: { k1: v1, k2: v2, k3: v3, ... },
   *   ...
   * }
   */
  if (error) {
    return {
      rows: [{ Info: 'An error occured.' }],
      colNames: ['Info'],
    };
  }
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

export function getBarPlot (gene, omics, feature, dataset, specimen, cancer, element) {
  let url = plotUrl + '/data_url/bar';
  url += `?gene=${encodeURIComponent(gene)}`;
  url += `&feature=${encodeURIComponent(feature)}`;
  url += `&dataset=${encodeURIComponent(dataset)}`;
  url += `&disease=${encodeURIComponent(cancer)}`;
  url += `&specimen=${encodeURIComponent(specimen)}`;
  url += `&entity=${encodeURIComponent(element)}`;
  return fetch(url)
    .then(async (res) => {
      if (res.ok) return res.json();
      if (res.status === 400) throw new NoDataError((await res.json()).detail);
      throw new Error((await res.json()).detail);
    });
}

export function getStackedBoxPlot (gene, omics, feature, dataset, specimen, element) {
  let url = plotUrl + '/data_url/box_stacked';
  url += `?gene=${encodeURIComponent(gene)}`;
  url += `&feature=${encodeURIComponent(feature)}`;
  url += `&dataset=${encodeURIComponent(dataset)}`;
  url += `&specimen=${(encodeURIComponent(specimen))}`;
  url += `&entity=${encodeURIComponent(element)}`;
  return fetch(url).then(async (res) => {
    if (res.ok) return res.text();
    if (res.status === 400) throw new NoDataError((await res.json()).detail);
    throw new Error((await res.json()).detail);
  });
}

export function getNonStackedBoxPlot (gene, omics, feature, dataset, specimen, element) {
  let url = plotUrl + '/data_url/box_unstacked';
  url += `?gene=${encodeURIComponent(gene)}`;
  url += `&feature=${encodeURIComponent(feature)}`;
  url += `&dataset=${encodeURIComponent(dataset)}`;
  url += `&specimen=${encodeURIComponent(specimen)}`;
  url += `&entity=${encodeURIComponent(element)}`;
  return fetch(url).then(async (res) => {
    if (res.ok) return res.text();
    if (res.status === 400) throw new NoDataError((await res.json()).detail);
    throw new Error((await res.json()).detail);
  });
}

export function getHeatMap (gene, omics, feature, dataset, specimen, element) {
  let url = plotUrl + '/data_url/heat_map';
  url += `?gene=${encodeURIComponent(gene)}`;
  url += `&feature=${encodeURIComponent(feature)}`;
  url += `&dataset=${encodeURIComponent(dataset)}`;
  url += `&specimen=${encodeURIComponent(specimen)}`;
  url += `&entity=${encodeURIComponent(element)}`;
  return fetch(url).then(async (res) => {
    if (res.ok) return res.text();
    if (res.status === 400) throw new NoDataError((await res.json()).detail);
    throw new Error((await res.json()).detail);
  });
}

/**
 * @deprecated
 */
export function getEntity (gene, omics, feature, dataset, specimen) {
  return fetch(serverListeningUrl + '/misc/findCancerTableField', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({
      omics,
      subomics: feature,
      dataset,
      element: null,
      cancer: null,
      specimen,
      value: null,
      toFind: 'element',
    }),
  })
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error();
    })
    .then((resJson) => (resJson.values)[0]);
}

export function getComparisonAnentities (gene, omics, feature, dataset, specimen, entity) {
  let url = plotUrl + '/misc/find_anentities';
  url += `?gene=${encodeURIComponent(gene)}`;
  url += `&feature=${encodeURIComponent(feature)}`;
  url += `&dataset=${encodeURIComponent(dataset)}`;
  url += `&specimen=${encodeURIComponent(specimen)}`;
  url += `&entity=${encodeURIComponent(entity)}`;
  return fetch(url)
    .then(async (res) => {
      if (res.ok) return res.json();
      if (res.status === 400) throw new NoDataError((await res.json()).detail);
      throw new Error((await res.json()).detail);
    });
}

export function getComparison (gene, omics, feature, dataset, specimen, entity, anentity = null) {
  let url = plotUrl + '/data_url/comparison';
  url += `?gene=${encodeURIComponent(gene)}`;
  url += `&feature=${encodeURIComponent(feature)}`;
  url += `&dataset=${encodeURIComponent(dataset)}`;
  url += `&specimen=${encodeURIComponent(specimen)}`;
  url += `&entity=${encodeURIComponent(entity)}`;
  if (anentity) { url += `&anentity=${encodeURIComponent(anentity)}`; }
  return fetch(url)
    .then(async (res) => {
      if (res.ok) return res.json();
      if (res.status === 400) throw new NoDataError((await res.json()).detail);
      throw new Error((await res.json()).detail);
    });
}

export function getEndmotifComparison (motif, dataset, specimen) {
  let url = plotUrl + '/data_url/endmotif_comparison';
  url += `?feature=${encodeURIComponent('endmotif')}`;
  url += `&motif=${encodeURIComponent(motif)}`;
  url += `&dataset=${encodeURIComponent(dataset)}`;
  url += `&specimen=${encodeURIComponent(specimen)}`;
  return fetch(url)
    .then(async (res) => {
      if (res.ok) return res.json();
      if (res.status === 400) throw new NoDataError((await res.json()).detail);
      throw new Error((await res.json()).detail);
    });
}

export function getMicrobeComparison (omics, motif, dataset, specimen) {
  let url = plotUrl + '/data_url/microbe_comparison';
  url += `?feature=${encodeURIComponent('microbe')}`;
  url += `&omics=${encodeURIComponent(omics)}`;
  url += `&motif=${encodeURIComponent(motif)}`;
  url += `&dataset=${encodeURIComponent(dataset)}`;
  url += `&specimen=${encodeURIComponent(specimen)}`;
  return fetch(url)
    .then(async (res) => {
      if (res.ok) return res.json();
      if (res.status === 400) throw new NoDataError((await res.json()).detail);
      throw new Error((await res.json()).detail);
    });
}

export function getDiseases (feature, dataset, specimen, entity) {
  let url = plotUrl + '/misc/select_diseases';
  url += `?feature=${encodeURIComponent(feature)}`;
  url += `&dataset=${encodeURIComponent(dataset)}`;
  url += `&specimen=${encodeURIComponent(specimen)}`;
  url += `&entity=${encodeURIComponent(entity)}`;
  return fetch(url)
    .then(async (res) => {
      if (res.ok) return res.json(); // img data url
      if (res.status === 400) throw new NoDataError((await res.json()).detail);
      throw new Error((await res.json()).detail);
    });
}

export function getDiseasesMicrobe (motif, dataset, specimen) {
  let url = plotUrl + '/misc/select_diseases_microbe';
  url += encodeQueryParams({ motif, dataset, specimen });
  return fetch(url)
    .then(async (res) => {
      if (res.ok) return res.json(); // img data url
      if (res.status === 400) throw new NoDataError((await res.json()).detail);
      throw new Error((await res.json()).detail);
    });
}

export function newComparison (
  gene,
  feature,
  dataset,
  specimen,
  entity,
  disease1,
  disease2,
  anentity = null,
) {
  let url = plotUrl + '/misc/new_comparison_two';
  const queryObj = {
    gene,
    feature,
    dataset,
    specimen,
    entity,
    disease1,
    disease2,
  };
  if (anentity) { queryObj.anentity = anentity; }
  url += encodeQueryParams(queryObj);
  return fetch(url)
    .then(async (res) => {
      if (res.ok) return res.json(); // img data url
      if (res.status === 400) throw new NoDataError((await res.json()).detail);
      throw new Error((await res.json()).detail);
    });
}

export function newComparisonCls3 (
  motif,
  feature,
  dataset,
  specimen,
  disease1,
  disease2,
) {
  let url = plotUrl + '/misc/new_comparison_two_cls3';
  const queryObj = {
    motif,
    feature,
    dataset,
    specimen,
    disease1,
    disease2,
  };
  if (feature === 'endmotif') {
    queryObj.entity = '4mer';
  }
  url += encodeQueryParams(queryObj);
  return fetch(url)
    .then(async (res) => {
      if (res.ok) return res.json(); // img data url
      if (res.status === 400) throw new NoDataError((await res.json()).detail);
      throw new Error((await res.json()).detail);
    });
}
