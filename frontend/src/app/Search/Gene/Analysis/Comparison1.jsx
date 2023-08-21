import { default as React, useEffect, useState } from 'react';
import LoadingGlower from '../../../../components/LoadingGlower';
import { getComparison } from '../../dataApi/getGeneData';
import MyAlert from '../../../../components/MyAlert';

export default function Comparison1 ({ gene, omics, feature, dataset, specimen, element }) {
  const [image, setImage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  useEffect(() => {
    setIsLoading(true);
    getComparison(gene, omics, feature, dataset, specimen, element)
      .then((image) => {
        setImage(image);
        setErrorMessage(null);
      })
      .catch((e) => { setErrorMessage(e); })
      .finally(() => { setIsLoading(false); });
  }, [gene, omics, feature, dataset, specimen, element]);

  if (isLoading) { return <LoadingGlower />; }

  if (errorMessage) { return <MyAlert error={errorMessage} />; }

  return (
    image && (
      <div className="d-flex justify-content-center">
        <img className="w-80" src={image} alt="comparison" />
      </div>
    )
  );
}
