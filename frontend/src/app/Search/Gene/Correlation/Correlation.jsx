import { default as React, useState, useEffect } from 'react';
import InnerHtml from 'dangerously-set-html-content';
import { nanoid } from 'nanoid';
import correlationOptions from './correlationOptions.json';
import {
  beautifyOmics,
  beautifyFeature,
  beautifyEntity,
  beautifySpecimen,
} from '../../../../utils/beautify';
import { getSpecimenList, getCorrPlot } from './dataApi';
import MyAlert from '../../../../components/MyAlert';
import LoadingGlower from '../../../../components/LoadingGlower';

export default function Correlation ({ gene }) {
  // const SECOND_CLASS = ['altp', 'chim', 'edit', 'snp', 'splc', 'itst'];
  const omicsFeatureList = [
    ['cfdna', 'bsseq'],
    ['cfdna', 'dipseq'],
    ['cfdna', 'fragsize'],
    ['cfdna', 'no'],
    ['cfrna', 'expr'],
    ['cfrna', 'apa'],
    ['cfrna', 'altp'],
    ['cfrna', 'chim'],
    // ['cfrna', 'edit'],
    // ['cfrna', 'snp'],
    ['cfrna', 'splc'],
    ['pro', 'itst'],
  ].map(([omics, feature]) => `${omics}-${feature}`);

  function _getEntityList (omicsFeature) {
    const [omics, feature] = omicsFeature.split('-');
    return [...correlationOptions[omics][feature]];
  }

  const [feature1, setFeature1] = useState('cfdna-bsseq');
  const [entity1, setEntity1] = useState('gene');

  const [feature2, setFeature2] = useState('cfdna-fragsize');
  const [entity2, setEntity2] = useState('gene');

  const [specimenList, setSpecimenList] = useState(['plasma']);
  const [specimen, setSpecimen] = useState('plasma');

  const [specimenLoading, setSpecimenLoading] = useState(false);

  const [specimenErrorMessage, setSpecimenErrorMessage] = useState(null);

  useEffect(() => {
    setSpecimenLoading(true);
    const [oomics1Ignored, ffeature1] = feature1.split('-');
    const [oomics2Ignored, ffeature2] = feature2.split('-');
    getSpecimenList(ffeature1, ffeature2)
      .then((data) => {
        data.sort((prev) => {
          if (prev === 'plasma') { return -1; }
          return 1;
        });
        setSpecimenList(data);
        setSpecimen(data[0]);
        setSpecimenErrorMessage(null);
      })
      .catch((e) => { setSpecimenErrorMessage(e); })
      .finally(() => { setSpecimenLoading(false); });
  }, [feature1, feature2]);

  const [plotHtml, setPlotHtml] = useState(null);
  const [plotErrorMessage, setPlotErrorMessage] = useState(null);
  const [plotLoading, setPlotLoading] = useState(false);

  function drawPlot () {
    const [omics1Ignored, ffeature1] = feature1.split('-');
    const [omics2Ignored, ffeature2] = feature2.split('-');
    setPlotLoading(true);
    setPlotErrorMessage(null);
    getCorrPlot(gene, ffeature1, entity1, ffeature2, entity2, specimen)
      .then((data) => { setPlotHtml(data); setPlotErrorMessage(null); })
      .catch((e) => { setPlotErrorMessage(e); })
      .finally(() => { setPlotLoading(false); });
  }

  useEffect(() => {
    const [omics1Ignored, ffeature1] = feature1.split('-');
    const [omics2Ignored, ffeature2] = feature2.split('-');
    setPlotLoading(true);
    setPlotErrorMessage(null);
    getCorrPlot(gene, ffeature1, entity1, ffeature2, entity2, specimen)
      .then((data) => { setPlotHtml(data); setPlotErrorMessage(null); })
      .catch((e) => { setPlotErrorMessage(e); })
      .finally(() => { setPlotLoading(false); });
  }, [gene]);

  const SECOND_CLASS = ['altp', 'apa', 'chim', 'edit', 'snp', 'splc', 'itst'];

  return (
    <>
      <div className="exomics-callout">
        <div>
          <p>
            Users can select 2 features you want to explore,
            and corresponding specimen. Then you can check
            correlation of those 2 features in every relative disease.
            <br />
            **Note**: For features including&nbsp;
            {SECOND_CLASS.map((cls) => beautifyFeature(cls)).join(', ')}
            , please wait a litter longer as the calculation can be expensive.
          </p>
        </div>
      </div>

      {specimenErrorMessage && <MyAlert error={specimenErrorMessage} />}

      {!specimenErrorMessage && (
      <div className="row gx-2">
        {/* begin::selections */}
        <div className="col-md-3 col-12 pt-2">
          <div className="mb-2">
            <label className="form-label" style={{ fontSize: '.875rem' }} htmlFor="select_cor_feature_1">
              Feature 1
            </label>
            <select
              className="form-select form-select-sm"
              id="select_cor_feature_1"
              value={feature1}
              onChange={
                  (e) => {
                    const nextFeature = e.target.value;
                    setFeature1(nextFeature);
                    const nextEntityList = _getEntityList(nextFeature);
                    setEntity1(nextEntityList[0]);
                  }
                }
            >
              {omicsFeatureList.map((omicsFeature) => {
                const [omics, feature] = omicsFeature.split('-');
                const text = `${beautifyOmics(omics)} -- ${beautifyFeature(feature)}`;
                return <option value={omicsFeature} key={omicsFeature}>{text}</option>;
              })}
            </select>
          </div>

          <div className="my-2">
            <label className="form-label" style={{ fontSize: '.875rem' }} htmlFor="select_cor_entity_1">
              Entity for feature 1
            </label>
            <select
              className="form-select form-select-sm"
              id="select_cor_entity_1"
              value={entity1}
              onChange={
                  (e) => {
                    const nextEntity = e.target.value;
                    setEntity1(nextEntity);
                  }
                }
            >
              {_getEntityList(feature1).map((entity) => (
                <option key={nanoid()} value={entity}>{beautifyEntity(entity)}</option>
              ))}
            </select>
          </div>

          <div className="my-2">
            <label className="form-label" style={{ fontSize: '.875rem' }} htmlFor="select_cor_feature_2">
              Feature 2
            </label>
            <select
              className="form-select form-select-sm"
              id="select_cor_feature_2"
              value={feature2}
              onChange={
                  (e) => {
                    const nextFeature = e.target.value;
                    setFeature2(nextFeature);
                    const nextEntityList = _getEntityList(nextFeature);
                    setEntity2(nextEntityList[0]);
                  }
                }
            >
              {omicsFeatureList.map((omicsFeature) => {
                const [omics, feature] = omicsFeature.split('-');
                const text = `${beautifyOmics(omics)} -- ${beautifyFeature(feature)}`;
                return <option value={omicsFeature} key={omicsFeature + '1'}>{text}</option>;
              })}
            </select>
          </div>

          <div className="my-2">
            <label className="form-label" style={{ fontSize: '.875rem' }} htmlFor="select_cor_entity_2">
              Entity for feature 2
            </label>
            <select
              className="form-select form-select-sm"
              id="select_cor_entity_2"
              value={entity2}
              onChange={
                  (e) => {
                    const nextEntity = e.target.value;
                    setEntity2(nextEntity);
                  }
                }
            >
              {_getEntityList(feature2).map((entity) => (
                <option key={nanoid()} value={entity}>{beautifyEntity(entity)}</option>
              ))}
            </select>
          </div>

          <div className="my-2">
            <label className="form-label" style={{ fontSize: '.875rem' }} htmlFor="select_cor_specimen">
              Specimen
            </label>
            <select
              className="form-select form-select-sm"
              id="select_specimen"
              value={specimen}
              onChange={
                  (e) => {
                    const nextSpecimen = e.target.value;
                    setSpecimen(nextSpecimen);
                  }
                }
            >
              {specimenList.map((specimen) => (
                <option key={nanoid()} value={specimen}>{beautifySpecimen(specimen)}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            disabled={
                specimenLoading || (feature1 === feature2)
              }
            onClick={drawPlot}
          >
            Draw
          </button>
        </div>
        {/* end::selections */}
        {/* start::plot */}
        <div className="col-md-9 col-12 pt-2 d-flex align-items-center justify-content-center overflow-x-auto">
          {
              plotErrorMessage
                ? <MyAlert error={plotErrorMessage} />
                : (
                  (plotLoading || (!plotHtml))
                    ? <LoadingGlower />
                    : <InnerHtml html={plotHtml} />
                )
            }
        </div>
        {/* end::plot */}
      </div>
      )}
    </>
  );
}
