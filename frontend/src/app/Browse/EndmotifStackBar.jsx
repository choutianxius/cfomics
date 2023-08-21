import { default as React, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import InnerHtml from 'dangerously-set-html-content';
import { plotUrl } from '../../config';
import LoadingSpinner from '../../components/LoadingSpinner';
import MyAlert from '../../components/MyAlert';
import NoDataError from '../../utils/errors/NoDataError';

function NavButton ({ content, isActive, onClick = () => {} }) {
  return (
    <li
      key={nanoid()}
      className="nav-item"
    >
      <button
        className={'nav-link' + (isActive ? ' active' : '')}
        type="button"
        onClick={onClick}
      >
        {content}
      </button>
    </li>
  );
}

export default function EndmotifStackBar ({
  dataset = 'gse81314',
  specimen = 'plasma',
}) {
  const [innerHtml, setInnerHtml] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [nmer, setNmer] = useState(4);

  useEffect(() => {
    setIsLoading(true);

    let url = plotUrl + '/data_url/browse_endmotif_stack_bar';
    url += `?dataset=${encodeURIComponent(dataset)}`;
    url += `&specimen=${encodeURIComponent(specimen)}`;
    url += `&nmer=${encodeURIComponent(nmer)}`;

    fetch(url)
      .then(async (res) => {
        if (res.ok) return res.text();
        if (res.status === 400) throw new NoDataError((await res.json()).detail);
        throw new Error((await res.json()).detail);
      })
      .then((data) => {
        // succeed
        setInnerHtml(data);
        setErrorMessage(null);
      })
      .catch((e) => {
        // fail
        setErrorMessage(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dataset, specimen, nmer]);

  if (isLoading) { return <LoadingSpinner />; }

  if (errorMessage) { return <MyAlert error={errorMessage} />; }

  return innerHtml && (
    <>
      <h6>End Motif Profile</h6>
      <div className="exomics-horizontal-rule" />
      <div className="d-flex flex-column align-items-center">
        <ul className="nav nav-tabs mb-3 border-bottom justify-content-center">
          {
            [2, 3, 4].map((n) => (
              <NavButton
                content={`${n}-mer`}
                onClick={() => { setNmer(n); }}
                isActive={n === nmer}
              />
            ))
          }
        </ul>
        <InnerHtml html={innerHtml} />
      </div>
    </>
  );
}
