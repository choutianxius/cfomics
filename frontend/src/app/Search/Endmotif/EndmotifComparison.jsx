import { default as React, useEffect, useState } from 'react';
import LoadingGlower from '../../../components/LoadingGlower';
import MyAlert from '../../../components/MyAlert';
import { getEndmotifComparison } from '../dataApi/getGeneData';

export default function EndmotifComparison ({ motif, dataset, specimen }) {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState();
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    setIsLoading(true);
    getEndmotifComparison(motif, dataset, specimen)
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
