export default function encodeQueryParams (queryObj) {
  return '?' + Object.entries(queryObj).map(([k, v]) => (
    `${k}=${encodeURIComponent(v)}`
  )).join('&');
}
