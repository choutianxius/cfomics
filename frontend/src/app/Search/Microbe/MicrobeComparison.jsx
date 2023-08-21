import { default as React, useEffect, useState } from 'react';
import LoadingGlower from '../../../components/LoadingGlower';
import { getMicrobeComparison } from '../dataApi/getGeneData';
import MyAlert from '../../../components/MyAlert';

export default function MicrobeComparison ({ omics, motif, dataset, specimen }) {
  const omicsIgnored = omics;
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [image, setImage] = useState();

  useEffect(() => {
    setIsLoading(true);
    getMicrobeComparison(omics, motif, dataset, specimen)
      .then((image) => {
        setImage(image);
        setErrorMessage(null);
      })
      .catch((e) => { setErrorMessage(e); })
      .finally(() => { setIsLoading(false); });
  }, [motif, dataset, specimen]);

  if (isLoading) { return <LoadingGlower />; }
  if (errorMessage) { return <MyAlert error={errorMessage} />; }

  return image && (
    <div className="d-flex justify-content-center">
      <img className="w-80" src={image} alt="endmotifComparison" />
    </div>
  );
}
