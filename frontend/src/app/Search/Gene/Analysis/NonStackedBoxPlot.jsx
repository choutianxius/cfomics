import { default as React, useEffect, useState } from 'react';
import InnerHtml from 'dangerously-set-html-content';
import { getNonStackedBoxPlot } from '../../dataApi/getGeneData';
import LoadingGlower from '../../../../components/LoadingGlower';
import MyAlert from '../../../../components/MyAlert';

export default function NonStackedBoxPlot ({ gene, omics, feature, dataset, specimen, element }) {
  const [image, setImage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    setIsLoading(true);
    getNonStackedBoxPlot(gene, omics, feature, dataset, specimen, element)
      .then((image) => {
        setImage(image);
        setErrorMessage(null);
      })
      .catch((e) => { setErrorMessage(e); })
      .finally(() => {
        setIsLoading(false);
      });
  }, [gene, omics, feature, dataset, specimen, element]);

  if (isLoading) { return <LoadingGlower />; }

  if (errorMessage) { return <MyAlert error={errorMessage} />; }

  return image && <InnerHtml html={image} />;
}
