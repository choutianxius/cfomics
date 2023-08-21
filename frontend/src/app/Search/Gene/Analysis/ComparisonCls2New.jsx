import { default as React, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import LoadingGlower from '../../../../components/LoadingGlower';
import { getComparisonAnentities, getDiseases, newComparison } from '../../dataApi/getGeneData';
import MyAlert from '../../../../components/MyAlert';
import { beautifyDiseaseCondition } from '../../../../utils/beautify';
import NoDataError from '../../../../utils/errors/NoDataError';

export default function ComparisonCls2New ({
  gene,
  omics,
  feature,
  dataset,
  specimen,
  element,
}) {
  const [diseaseList, setDiseaseList] = useState([]);
  const [loadingDiseaseList, setLoadingDiseaseList] = useState(false);
  const [diseaseListError, setDiseaseListError] = useState();
  const [disease1, setDisease1] = useState();
  const [disease2, setDisease2] = useState();

  const [anentityList, setAnentityList] = useState([]);
  const [anentity, setAnentity] = useState();

  const [img, setImg] = useState();
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState();

  function draw () {
    if ((!disease1) || (!disease2) || (!anentity)) { return; }
    setImgLoading(true);
    setImgError(null);
    newComparison(gene, feature, dataset, specimen, element, disease1, disease2, anentity)
      .then((data) => { setImg(data); setImgError(null); })
      .catch((e) => { setImgError(e); })
      .finally(() => { setImgLoading(false); });
  }

  useEffect(() => {
    setLoadingDiseaseList(true);
    const promise1 = getDiseases(feature, dataset, specimen, element);
    const promise2 = getComparisonAnentities(gene, omics, feature, dataset, specimen, element);
    Promise.all([promise1, promise2])
      .then(([data1, data2]) => {
        // data1: diseases
        if (data1.length === 0) {
          throw new Error('Failed to fetch disease list. Please try again later.');
        }
        if (data1.length === 1) {
          throw new NoDataError(`There is only one disease (${beautifyDiseaseCondition(data1[0])}) for the current dataset. No comparison available.`);
        }
        setDiseaseList(data1);
        const ddisease1 = data1[0];
        const ddisease2 = data1.filter((d) => d !== ddisease1)[0];
        setDisease1(ddisease1);
        setDisease2(ddisease2);

        if (data2.length === 0) {
          throw new Error('No entities found within the current gene. No comparison analysis available.');
        }
        setAnentityList(data2);
        const aanentity = data2[0];
        setAnentity(aanentity);
        setDiseaseListError(null);

        setImgLoading(true);
        newComparison(gene, feature, dataset, specimen, element, ddisease1, ddisease2, aanentity)
          .then((data) => { setImg(data); setImgError(null); })
          .catch((e) => { setImgError(e); })
          .finally(() => { setImgLoading(false); });
      })
      .catch((errors) => {
        if (Array.isArray(errors)) {
          setDiseaseListError(errors[0]);
        } else {
          setDiseaseListError(errors);
        }
      })
      .finally(() => { setLoadingDiseaseList(false); });
  }, [gene, omics, feature, dataset, specimen, element]);

  if (diseaseListError) {
    return <MyAlert error={diseaseListError} />;
  }

  if (loadingDiseaseList) { return <LoadingGlower />; }

  return (
    <div className="row gx-2">
      {/* begin::selections */}
      <div className="col-12 col-md-3 pt-2">
        {/* begin::select anentity */}
        <div className="mb-2">
          <label className="form-label" style={{ fontSize: '.875rem' }} htmlFor="select_comp2_anentity">
            Entity
          </label>
          <select
            className="form-select form-select-sm"
            id="select_comp2_anentity"
            value={anentity}
            onChange={
                (e) => {
                  setAnentity(e.target.value);
                }
              }
          >
            {anentityList.map((anentity) => (
              <option value={anentity} key={nanoid()}>
                {anentity}
              </option>
            ))}
          </select>
        </div>
        {/* end::select disease1 */}
        {/* begin::select disease1 */}
        <div className="mb-2">
          <label className="form-label" style={{ fontSize: '.875rem' }} htmlFor="select_comp2_disease_1">
            Disease 1
          </label>
          <select
            className="form-select form-select-sm"
            id="select_comp2_disease_1"
            value={disease1}
            onChange={
                (e) => {
                  setDisease1(e.target.value);
                }
              }
          >
            {diseaseList.map((disease) => (
              <option value={disease} key={nanoid()}>
                {beautifyDiseaseCondition(disease)}
              </option>
            ))}
          </select>
        </div>
        {/* end::select disease1 */}
        {/* begin::select disease2 */}
        <div className="mb-2">
          <label className="form-label" style={{ fontSize: '.875rem' }} htmlFor="select_comp2_disease_2">
            Disease 2
          </label>
          <select
            className="form-select form-select-sm"
            id="select_comp2_disease_2"
            value={disease2}
            onChange={
                (e) => {
                  setDisease2(e.target.value);
                }
              }
          >
            {diseaseList
              .filter((disease) => disease !== disease1)
              .map((disease) => (
                <option value={disease} key={nanoid()}>
                  {beautifyDiseaseCondition(disease)}
                </option>
              ))}
          </select>
        </div>
        {/* end::select disease2 */}
        {/* begin::confirm */}
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={draw}
        >
          Draw
        </button>
        {/* end::confirm */}
      </div>
      {/* end::selections */}
      {/* begin::plot area */}
      <div className="col-12 col-md-9 d-flex align-items-center justify-content-center">
        {imgError
          ? <MyAlert error={imgError} />
          : (imgLoading
            ? <LoadingGlower />
            : (img && <img className="w-100" src={img} alt="comparison" />)
          )}
      </div>
      {/* end::plot area */}
    </div>
  );
}
