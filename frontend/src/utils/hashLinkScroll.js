export default function hashLinkScroll (element, offsetRem) {
  const REM = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const yOffset = offsetRem * REM;
  const yCoordinate = element.getBoundingClientRect().top
                      + window.pageYOffset
                      + yOffset;
  window.scrollTo({
    top: yCoordinate,
    behavior: 'smooth',
  });
}

export function defaultHashLinkScroll (element) {
  hashLinkScroll(element, -5);
}
