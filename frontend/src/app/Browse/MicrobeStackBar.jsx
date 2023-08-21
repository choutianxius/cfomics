import { default as React, useState, useEffect } from 'react';
import InnerHtml from 'dangerously-set-html-content';
import { plotUrl } from '../../config';
import LoadingSpinner from '../../components/LoadingSpinner';
import MyAlert from '../../components/MyAlert';
import NoDataError from '../../utils/errors/NoDataError';

export default function MicrobeStackBar ({
  dataset = 'gse81314',
  specimen = 'plasma',
  element = 'c',
}) {
  const [innerHtml, setInnerHtml] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    setIsLoading(true);

    let url = plotUrl + '/data_url/browse_microbe_stack_bar';
    url += `?dataset=${encodeURIComponent(dataset)}`;
    url += `&specimen=${encodeURIComponent(specimen)}`;
    url += `&entity=${encodeURIComponent(element)}`;

    fetch(url)
      .then(async (res) => {
        if (res.ok) return res.text();
        if (res.status === 400) throw new NoDataError((await res.json()).detail);
        throw new Error((await res.json()).detail);
      })
      .then((data) => {
        setInnerHtml(data);
        setErrorMessage(null);
      })
      .catch((e) => {
        setErrorMessage(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dataset, specimen, element]);

  if (isLoading) { return <LoadingSpinner />; }

  if (errorMessage) { return <MyAlert error={errorMessage} />; }

  return innerHtml && (
    <>
      <div className="exomics-horizontal-rule" />
      <h6>Microbe Profile</h6>
      <div className="d-flex justify-content-center">
        <InnerHtml html={innerHtml} />
      </div>
    </>
  );
}
