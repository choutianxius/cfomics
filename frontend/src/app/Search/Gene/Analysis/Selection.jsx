import { default as React, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import AnalysisListGroup from '../../../../components/AnalysisListGroup';
import geneOptions from '../../selectOptions/geneOptions.json';
import {
  beautifyOmics,
  beautifyFeature,
  beautifyDataset,
  beautifySpecimen,
  beautifyEntity,
} from '../../../../utils/beautify';
import { defaultHashLinkScroll } from '../../../../utils/hashLinkScroll';

const featureTypeTitle = (
  <div className="d-flex p-0 align-items-start">
    Feature Type
    <HashLink to="/help#pipeline-intro" scroll={defaultHashLinkScroll}>
      <div className="exomics-tooltip">
        <FontAwesomeIcon
          style={{ height: '1rem', alignSelf: 'center', marginLeft: '.5rem' }}
          icon={faInfoCircle}
        />
        <span className="exomics-tooltip-text exomics-tooltip-text-end">
          Click to view feature type descriptions
        </span>
      </div>
    </HashLink>
  </div>
);

const datasetTitle = (
  <div className="d-flex p-0 align-items-start">
    Collection
    <HashLink to="/source#literature" scroll={defaultHashLinkScroll}>
      <div className="exomics-tooltip">
        <FontAwesomeIcon
          style={{ height: '1rem', alignSelf: 'center', marginLeft: '.5rem' }}
          icon={faInfoCircle}
        />
        <span className="exomics-tooltip-text exomics-tooltip-text-end">
          Click to view collection metadata
        </span>
      </div>
    </HashLink>
  </div>
);

function sortFeatures (prev, next) {
  const all = ['bsseq', 'dipseq', 'fragsize', 'no', 'expr', 'altp', 'apa', 'chim', 'snp', 'edit', 'splc'];
  const prevIdx = all.findIndex((x) => x === prev);
  const nextIdx = all.findIndex((x) => x === next);
  return (prevIdx - nextIdx);
}

export default function Selection ({
  onConfirm,
  dOmics,
  dFeature,
  dDataset,
  dSpecimen,
  dElement,
}) {
  // Helper functions
  function getOmicsList () {
    return geneOptions.map((x) => x.value);
  }

  function getFeatureList (omics) {
    const unsorted = geneOptions
      .find((x) => x.value === omics).children
      .map((x) => x.value);
    unsorted.sort(sortFeatures);
    return Array.from(unsorted);
  }

  function getDatasetList (omics, feature) {
    return geneOptions
      .find((x) => x.value === omics).children
      .find((x) => x.value === feature).children
      .map((x) => x.value);
  }

  function getSpecimenList (omics, feature, dataset) {
    return geneOptions
      .find((x) => x.value === omics).children
      .find((x) => x.value === feature).children
      .find((x) => x.value === dataset).children
      .map((x) => x.value);
  }

  function getElementList (omics, feature, dataset, specimen) {
    return geneOptions
      .find((x) => x.value === omics).children
      .find((x) => x.value === feature).children
      .find((x) => x.value === dataset).children
      .find((x) => x.value === specimen).children
      .map((x) => x.value);
  }

  // init
  // keep in sync with analysis parent
  const [omics, setOmics] = useState(dOmics);
  const [feature, setFeature] = useState(dFeature);
  const [dataset, setDataset] = useState(dDataset);
  const [specimen, setSpecimen] = useState(dSpecimen);
  const [element, setElement] = useState(dElement);

  const omicsList = getOmicsList();
  const featureList = getFeatureList(omics);
  const datasetList = getDatasetList(omics, feature);
  const specimenList = getSpecimenList(omics, feature, dataset);
  const elementList = getElementList(omics, feature, dataset, specimen);

  function handleChangeElement (nextElement) {
    setElement(nextElement);
  }

  function handleChangeSpecimen (nextSpecimen) {
    setSpecimen(nextSpecimen);
    const nextElement = getElementList(omics, feature, dataset, nextSpecimen)[0];
    setElement(nextElement);
  }

  function handleChangeDataset (nextDataset) {
    setDataset(nextDataset);
    const nextSpecimen = getSpecimenList(omics, feature, nextDataset)[0];
    setSpecimen(nextSpecimen);
    const nextElement = getElementList(omics, feature, nextDataset, nextSpecimen)[0];
    setElement(nextElement);
  }

  function handleChangeFeature (nextFeature) {
    setFeature(nextFeature);
    const nextDataset = getDatasetList(omics, nextFeature)[0];
    setDataset(nextDataset);
    const nextSpecimen = getSpecimenList(omics, nextFeature, nextDataset)[0];
    setSpecimen(nextSpecimen);
    const nextElement = getElementList(omics, nextFeature, nextDataset, nextSpecimen)[0];
    setElement(nextElement);
  }

  function handleChangeOmics (nextOmics) {
    setOmics(nextOmics);
    const nextFeature = getFeatureList(nextOmics)[0];
    setFeature(nextFeature);
    const nextDataset = getDatasetList(nextOmics, nextFeature)[0];
    setDataset(nextDataset);
    const nextSpecimen = getSpecimenList(nextOmics, nextFeature, nextDataset)[0];
    setSpecimen(nextSpecimen);
    const nextElement = getElementList(nextOmics, nextFeature, nextDataset, nextSpecimen)[0];
    setElement(nextElement);
  }

  return (
    <>
      <div className={'row mt-5' + ((elementList.length === 1) ? ' row-cols-4' : ' row-cols-5')}>

        <div className="col">
          <AnalysisListGroup
            title="Omics"
            options={omicsList}
            activeIdx={
              omicsList.findIndex((x) => x === omics)
            }
            onChangeOption={handleChangeOmics}
            beautify={beautifyOmics}
          />
        </div>

        <div className="col">
          <AnalysisListGroup
            title={featureTypeTitle}
            options={featureList}
            activeIdx={
              featureList.findIndex((x) => x === feature)
            }
            onChangeOption={handleChangeFeature}
            beautify={beautifyFeature}
          />
        </div>

        <div className="col">
          <AnalysisListGroup
            title={datasetTitle}
            options={datasetList}
            activeIdx={
              datasetList.findIndex((x) => x === dataset)
            }
            onChangeOption={handleChangeDataset}
            beautify={beautifyDataset}
          />
        </div>

        <div className="col">
          <AnalysisListGroup
            title="Specimen"
            options={specimenList}
            activeIdx={
              specimenList.findIndex((x) => x === specimen)
            }
            onChangeOption={handleChangeSpecimen}
            beautify={beautifySpecimen}
          />
        </div>

        <div className="col" hidden={elementList.length === 1}>
          <AnalysisListGroup
            title="Element"
            options={elementList}
            activeIdx={
              elementList.findIndex((x) => x === element)
            }
            onChangeOption={handleChangeElement}
            beautify={beautifyEntity}
          />
        </div>

      </div>

      <div className="d-flex justify-content-center mb-3 mt-5">
        <button
          type="button"
          className="btn btn-info fs-6 fw-bold text-white"
          onClick={
            () => {
              onConfirm(omics, feature, dataset, specimen, element);
            }
          }
        >
          Confirm
        </button>
      </div>

      <div className="exomics-callout">
        <div>
          <p>
            <strong>IMPORTANT</strong>
            :
            <br />
            To apply changes in the selected options, you must
            click the
            {' '}
            <strong>Confirm</strong>
            {' '}
            button above!
          </p>
        </div>
      </div>
    </>
  );
}
