import { default as React, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import LoadingGlower from '../../../../components/LoadingGlower';
import MyAlert from '../../../../components/MyAlert';
import { getComparisonAnentities, getComparison } from '../../dataApi/getGeneData';

export default function Comparison2 ({ gene, omics, feature, dataset, specimen, element }) {
  const [anentityList, setAnentityList] = useState();
  const [anentity, setAnentity] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage1, setErrorMessage1] = useState(); // anentityList error
  const [errorMessage2, setErrorMessage2] = useState(); // plot error

  useEffect(() => {
    setIsLoading(true);
    setErrorMessage2(null);
    getComparisonAnentities(gene, omics, feature, dataset, specimen, element)
      .then((entities) => {
        setAnentityList(entities);
        setAnentity(entities[0]);
        setErrorMessage1(null);
      })
      .catch((e) => { setErrorMessage1(e); })
      .finally(() => { setIsLoading(false); });
  }, [gene, omics, feature, dataset, specimen, element]);

  const [image, setImage] = useState();
  useEffect(() => {
    if (!anentity) { return; }
    setIsLoading(true);
    getComparison(gene, omics, feature, dataset, specimen, element, anentity)
      .then((image) => {
        setImage(image);
        setErrorMessage2(null);
      })
      .catch((e) => { setErrorMessage2(e); })
      .finally(() => { setIsLoading(false); });
  }, [gene, omics, feature, dataset, specimen, element, anentity]);

  if (isLoading) { return <LoadingGlower />; }

  if (errorMessage1) { return <MyAlert error={errorMessage1} />; }

  if (errorMessage2) { return <MyAlert error={errorMessage2} />; }

  if (anentityList) {
    if (anentityList.length === 0) {
      return <div>No comparison available.</div>;
    }
  }

  return (
    <>
      {anentityList && (
        <div className="row mb-3">
          <div className="col">
            <div
              className="list-group list-group-flush"
              style={{ maxHeight: '12rem', overflowY: 'scroll' }}
            >
              {
              anentityList.map((ent) => (
                <button
                  type="button"
                  key={uuidv4()}
                  onClick={() => { setAnentity(ent); }}
                  className={
                    'list-group-item list-group-item-action text-center'
                      + (ent === anentity ? ' active' : '')
                  }
                >
                  {ent}
                </button>
              ))
            }
            </div>
          </div>
        </div>
      )}
      {image && (
      <div className="d-flex justify-content-center">
        <img className="w-80" src={image} alt="comparison" />
      </div>
      )}
    </>
  );
}
