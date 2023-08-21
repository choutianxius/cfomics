import { plotUrl } from '../../../../config';
import encodeQueryParams from '../../../../utils/encodeQueryParams';
import NoDataError from '../../../../utils/errors/NoDataError';

export function getSpecimenList (feature1, feature2) {
  let url = plotUrl + '/misc/corr_specimen';
  url += encodeQueryParams({ feature1, feature2 });
  return fetch(url)
    .then(async (res) => {
      if (res.ok) {
        return res.json();
      }
      if (res.status === 400) throw new NoDataError((await res.json()).detail);
      throw new Error((await res.json()).detail);
    });
}

export function getCorrPlot (
  gene,
  feature1,
  entity1,
  feature2,
  entity2,
  specimen,
) {
  let url = plotUrl + '/misc/corr_scatter';
  url += encodeQueryParams({ gene, feature1, entity1, feature2, entity2, specimen });
  const controller = new AbortController();
  const timeoutRequest = setTimeout(() => {
    controller.abort();
  }, 300000);
  return fetch(url, { signal: controller.signal })
    .then(async (res) => {
      clearTimeout(timeoutRequest);
      if (res.ok) {
        return res.text();
      }
      if (res.status === 400) throw new NoDataError((await res.json()).detail);
      throw new Error((await res.json()).detail);
    });
}
