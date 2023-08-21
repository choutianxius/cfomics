import { default as React, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import LoadingGlower from '../../../../components/LoadingGlower';
import { getDiseases, newComparison } from '../../dataApi/getGeneData';
import MyAlert from '../../../../components/MyAlert';
import { beautifyDiseaseCondition } from '../../../../utils/beautify';
import NoDataError from '../../../../utils/errors/NoDataError';

export default function ComparisonCls1New ({
  gene,
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

  const [img, setImg] = useState();
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState();

  function draw () {
    if ((!disease1) || (!disease2)) { return; }
    setImgLoading(true);
    setImgError(null);
    newComparison(gene, feature, dataset, specimen, element, disease1, disease2, null)
      .then((data) => { setImg(data); setImgError(null); })
      .catch((e) => { setImgError(e); })
      .finally(() => { setImgLoading(false); });
  }

  useEffect(() => {
    setLoadingDiseaseList(true);
    getDiseases(feature, dataset, specimen, element)
      .then((data) => {
        if (data.length === 0) {
          throw new Error('Failed to fetch disease list. Please try again later.');
        }
        if (data.length === 1) {
          throw new NoDataError(`There is only one disease (${beautifyDiseaseCondition(data[0])}) for the current dataset. No comparison available.`);
        }
        setDiseaseList(data);
        setDiseaseListError(null);
        const ddisease1 = data[0];
        const ddisease2 = data.filter((d) => d !== ddisease1)[0];
        setDisease1(ddisease1);
        setDisease2(ddisease2);

        setImgLoading(true);
        newComparison(gene, feature, dataset, specimen, element, ddisease1, ddisease2, null)
          .then((data) => { setImg(data); setImgError(null); })
          .catch((e) => { setImgError(e); })
          .finally(() => { setImgLoading(false); });
      })
      .catch((e) => { setDiseaseListError(e); })
      .finally(() => { setLoadingDiseaseList(false); });
  }, [feature, dataset, specimen, element]);

  if (diseaseListError) {
    return <MyAlert error={diseaseListError} />;
  }

  if (loadingDiseaseList) { return <LoadingGlower />; }

  return (
    <div className="row gx-2">
      {/* begin::selections */}
      <div className="col-12 col-md-3 pt-2">
        {/* begin::select disease1 */}
        <div className="mb-2">
          <label className="form-label" style={{ fontSize: '.875rem' }} htmlFor="select_comp1_disease_1">
            Disease 1
          </label>
          <select
            className="form-select form-select-sm"
            id="select_comp1_disease_1"
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
          <label className="form-label" style={{ fontSize: '.875rem' }} htmlFor="select_comp1_disease_2">
            Disease 2
          </label>
          <select
            className="form-select form-select-sm"
            id="select_comp1_disease_2"
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
