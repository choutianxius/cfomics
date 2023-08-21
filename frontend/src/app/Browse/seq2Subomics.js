export function capitalize (s) {
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
}

export function beautify (s) {
  return s.trim().split('_').map((s1) => capitalize(s1)).join(' ');
}

export function seq2Subomics (seqName) {
  if (seqName === 'bsseq') {
    return '5-Methylcytosine';
  }
  if (seqName === 'dipseq') {
    return '5-Hydroxymethylcytosine';
  }

  return beautify(seqName);
}
