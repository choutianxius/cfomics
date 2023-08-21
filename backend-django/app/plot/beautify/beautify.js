function capitalize (s) {
  return (s[0].toUpperCase() + s.slice(1));
}

export default function beautify (s) {
  try {
    if (!s.includes('_')) {
      if (/^[a-z]+$/.test(s)) { return capitalize(s); }
      return s;
    }
    return s.split('_').map((x) => capitalize(x)).join(' ');
  } catch (e) {
    if (['', 'null', 'undefined'].includes(String(s))) {
      return 'N/A';
    }
    return s;
  }
}

export function beautifyOmics (omics) {
  if (omics === 'cfdna' || omics === 'cfrna') {
    return (omics.slice(0, 2).toLowerCase() + omics.slice(2).toUpperCase());
  }
  if (omics === 'pro') {
    return 'Proteome';
  }
  if (omics === 'met') {
    return 'Metabolome';
  }
  return beautify(omics);
}

export function beautifyEntity (entity) {
  if (entity === 'gene') {
    return 'Genes';
  }
  if (entity === 'promoter') {
    return 'Promoters';
  }
  if (entity === 'cgi') {
    return 'CpG Islands';
  }
  if (entity === 'bin') {
    return 'Bins';
  }
  if (entity === '4mer') {
    return '4-mer Motif';
  }
  if (entity === '0') {
    return 'Whether Classified';
  }
  if (entity === 'c') {
    return 'Class';
  }
  if (entity === 'd') {
    return 'Domain';
  }
  if (entity === 'f') {
    return 'Family';
  }
  if (entity === 'g') {
    return 'Genus';
  }
  if (entity === 'k') {
    return 'Kingdom';
  }
  if (entity === 'o') {
    return 'Order';
  }
  if (entity === 'p') {
    return 'Phylum';
  }
  if (entity === 's') {
    return 'Species';
  }
  if (entity === 'o') {
    return 'Order';
  }
  if (entity === '15t5') {
    return 'Region: -150~TSS~50bp';
  }
  if (entity === '31e1') {
    return 'Region: 300~100bp upstream Exon1';
  }
  if (entity === 'entity') {
    // return 'Entities';
    return 'N/A';
  }
  if (entity === 'met') {
    return 'Metabolite';
  }
  return beautify(entity);
}

export function beautifyFeature (feature) {
  if (feature === 'bsseq') {
    return 'Methylation (BS-seq)';
  }
  if (feature === 'dipseq') {
    return 'Methylation (DIP-seq)';
  }
  if (feature === 'endmotif') {
    return 'End Motif';
  }
  if (feature === 'fragsize') {
    return 'Fragment Size';
  }
  if (feature === 'microbe') {
    return 'Microbe';
  }
  if (feature === 'no') {
    return 'Nucleosomal Occupancy';
  }
  if (feature === 'altp') {
    return 'Alternative Promoter';
  }
  if (feature === 'apa') {
    return 'Alternative Poly-adenylation';
  }
  if (feature === 'chim') {
    return 'Chimeric RNA';
  }
  if (feature === 'edit') {
    return 'RNA Editing';
  }
  if (feature === 'expr') {
    return 'Expression';
  }
  if (feature === 'snp') {
    return 'RNA SNP';
  }
  if (feature === 'splc') {
    return 'RNA Splicing';
  }
  if (feature === 'te') {
    return 'Transposal Element';
  }
  if (feature === 'itst') {
    return 'Intensity';
  }
  if (feature === 'area') {
    return 'Area of Peak';
  }
  return beautify(feature);

  // ...
}

export function beautifyDataset (dataset) { return dataset.toUpperCase(); }

export function beautifySpecimen (specimen) {
  if (['plasma', 'serum', 'blood', 'urine'].includes(specimen)) {
    return (specimen.slice(0, 1).toUpperCase() + specimen.slice(1).toLowerCase());
  }
  if (specimen === 'csf') {
    return 'Cerebrospinal Fluid (CSF)';
  }
  if (specimen === 'pbmc') {
    return 'Peripheral Blood Mononuclear Cell (PBMC)';
  }
  if (specimen === 'ev') {
    return 'Extracellular Vesicles (EV)';
  }
  if (specimen === 'tep') {
    return 'Tumour-educated Platelets (TEP)';
  }
  if (specimen === 'cec') {
    return 'Circulating Epithelial Cell (CEC)';
  }
  if (specimen === 'ctc') {
    return 'Circulating Tumor Cells (CTC)';
  }
  if (specimen === 'unknown') {
    return 'Unknown';
  }
  if (specimen === 'rbc') {
    return 'Red Blood Cell';
  }
  if (specimen === 'sputum') {
    return 'Sputum';
  }
  if (specimen === 'rinse') {
    return 'Mouse Rinse';
  }
  return beautify(specimen);
}

// Beautify other fields

export function beautifyDiseaseCondition (disease) {
  // eslint-disable-next-line max-len
  // if (disease === 'crc' || disease === 'mb' || disease === 'eac' || disease === 'escc' || disease === 'gc' || disease === 'lihc' || disease === 'pdac' || disease === 'luca' || disease === 'cll' || disease === 'dlbc' || disease === 'prad' || disease === 'laml' || disease === 'brca' || disease === 'gbm' || disease === 'paad' || disease === 'thca' || disease === 'kirc' || disease === 'oc') {
  //   return disease.toUpperCase();
  // }
  if (['crc', 'mm', 'uc', 'sarc', 'rcc', 'mel', 'hl', 'hnc', 'ec', 'ccc', 'mb', 'eac', 'escc', 'gc', 'lihc', 'pdac', 'luca', 'cll', 'dlbc', 'prad', 'laml', 'brca', 'gbm', 'paad', 'thca', 'kirc', 'oc'].includes(disease)) { return disease.toUpperCase(); }
  if (disease === 'ct' || disease === 'ctrl') {
    return 'Control';
  }
  if (disease === 'mean') {
    return 'Mean Value';
  }
  if (disease === 'cf') {
    return 'Cystic Fibrosis';
  }
  if (disease === 'ct_hp') {
    return 'Hydrocephalus patient';
  }
  if (disease === 'ct_e') {
    return 'Epilepsy';
  }
  if (disease === 'ct_pd') {
    return 'Pancreatic Disease';
  }
  if (disease === 'ct_cd') {
    return 'Crohn\'s disease';
  }
  if (disease === 'ct_bd') {
    return 'Bowel Disease';
  }
  if (disease === 'ct_ms') {
    return 'Multiple Sclerosis';
  }
  if (disease === 'ct_ph') {
    return 'Pulmonary Hypertension';
  }
  if (disease === 'ct_uc') {
    return 'Ulcerative Colitis';
  }
  if (disease === 'ct_ap') {
    return 'Angina Pectoris';
  }
  if (disease === 'ct_nstemi') {
    return 'Non-ST-Elevation Myocardial Infarction';
  }
  if (disease === 'firefighter') {
    return 'Firefighter';
  }
  if (disease === 'ct_sap') {
    return 'Stable Angina Pectoris';
  }
  if (disease === 'ct_uap') {
    return 'Unstable Angina Pectoris';
  }
  if (disease === 'ct_as') {
    return 'Atherosclerosis';
  }
  if (disease === 'ct_gh') {
    return 'Hematuria';
  }
  if (disease === 'ct_lc') {
    return 'Liver cirrhosis';
  }
  if (disease === 'ct_bll') {
    return 'Benign liver lesions';
  }
  if (disease === 'ct_chb') {
    return 'Chronic Hepatitis B virus';
  }
  if (disease === 'ct_hc' || disease === 'ctrl_hc' || disease === 'hc') {
    return 'Healthy';
  }
  if (disease === 'ct_hbvc' || disease === 'ctrl_hbvc' || disease === 'hbvc') {
    return 'HBV carrier';
  }
  if (disease === 'ct_hbvlc') {
    return 'HBV Cirrhosis';
  }
  if (disease === 'ct_dsvscrc') {
    return 'Corresponding Disease of CRC';
  }
  if (disease === 'ct_dsvsgc') {
    return 'Corresponding Disease of GC';
  }
  if (disease === 'ct_dsvslihc') {
    return 'Corresponding Disease of LIHC';
  }
  if (disease === 'ct_dsvspaad') {
    return 'Corresponding Disease of PAAD';
  }
  if (disease === 'ct_dsvsthca') {
    return 'Corresponding Disease of THCA';
  }
  if (disease === 'ct_cp') {
    return 'Chronic Pancreatitis';
  }
  if (disease === 'spontaneouslypreterm') {
    return 'Spontaneously Preterm';
  }
  if (disease === 'ct_cld') {
    return 'Chronic liver disease';
  }
  if (disease === 'brca_no_metastatic') {
    return 'BRCA without Metastatic';
  }
  if (disease === 'lcc_vs_normal') {
    return 'LCC vs. Normal';
  }
  if (disease === 'lcc_vs_pbs') {
    return 'LCC vs. PBS Normal';
  }
  if (disease === 'normal_vs_pbs') {
    return 'Normal vs. PBS Normal';
  }
  if (disease === 'rcc_vs_lcc') {
    return 'RCC vs. LCC';
  }
  if (disease === 'rcc_vs_normal') {
    return 'RCC vs. Normal';
  }
  if (disease === 'rcc_vs_pbs') {
    return 'RCC vs. PBS Normal';
  }
  if (disease === 'hc_nobrca1_2') {
    return 'Healthy without BRCA1/2 carriers';
  }
  if (disease === 'hc_withbrca1_2') {
    return 'Healthy with BRCA1/2 carriers';
  }
  if (disease === 'oc_withbrca1_2') {
    return 'OC with BRCA1/2 carriers';
  }
  if (disease === 'oc_nobrca1_2') {
    return 'OC without BRCA1/2 carriers';
  }
  if (disease === 'pooling') {
    return 'Pooling';
  }
  if (disease === 'brca_withnct') {
    return 'BRCA after NCT';
  }
  if (disease === 'full_term') {
    return 'Full term';
  }
  if (disease === 'brca_lymph_node_metastatic') {
    return 'BRCA with lymph node metastatic';
  }
  if (disease === 'udn') {
    return 'Proband';
  }
  if (disease === 'blank') {
    return 'Blank';
  }
  if (disease === 'ph') {
    return 'Pitt Hopkins disease';
  }
  return beautify(disease);
}

export function beautifyValue (value) {
  if (value === 'beta') {
    return 'Beta value';
  }
  if (value === 'tpm_5hmc') {
    return 'TPM(5hmC)';
  }
  if (value === 'tpm_5mc') {
    return 'TPM(5mC)';
  }
  if (value === 'motifratio') {
    return 'Proportion of Motifs';
  }
  if (value === 'ratio') {
    return 'Ratio of short fragment to long fragment';
  }
  if (value === 'ra') {
    return 'Relative Abundance';
  }
  if (value === 'noratio') {
    return 'Nucleosome-occupancy Ratio';
  }
  if (value === 'count') {
    return 'Read Count';
  }
  if (value === 'pdui') {
    return 'PDUI';
  }
  if (value === 'editratio') {
    return 'Editing Ratio';
  }
  if (value === 'snpratio') {
    return 'SNP Ratio';
  }
  if (value === 'iclv') {
    return 'IncLevel';
  }
  if (value === 'itst') {
    return 'Intensity';
  }
  if (value === 'area') {
    return 'Area of Peak';
  }

  return beautify(value);
}

export function beautifyBrowseColNames (colName) {
  const indexCols = Array.from(new Set([
    // gene_index
    'chromosome_name', 'end_position', 'ensembl_gene_id',
    'gene_biotype', 'Gene_ID', 'hgnc_symbol', 'Promoter_Gene_ID',
    'start_position', 'strand',
    // cgi_index
    'Cgi_ID', 'chr', 'end', 'start',
    // promoter_index
    'chromosome_name', 'end_position', 'ensembl_gene_id',
    'ensembl_gene_id_version', 'gene_biotype', 'hgnc_symbol',
    'Promoter_Gene_ID', 'Promoter_ID', 'start_position',
    'strand',
    // mirna_index
    'ensembl_gene_id', 'mir_id',
    // microbe_taxo
    'feature', 'taxo', 'taxo_id',
  ]));
  if (indexCols.includes(colName)) {
    return beautify(colName);
  }
  return beautifyDiseaseCondition(colName);
}

export function beautifyBrowseCells (colName, cell) {
  const indexCols = Array.from(new Set([
    // gene_index
    'chromosome_name', 'end_position', 'ensembl_gene_id',
    'gene_biotype', 'Gene_ID', 'hgnc_symbol', 'Promoter_Gene_ID',
    'start_position', 'strand',
    // cgi_index
    'Cgi_ID', 'chr', 'end', 'start',
    // promoter_index
    'chromosome_name', 'end_position', 'ensembl_gene_id',
    'ensembl_gene_id_version', 'gene_biotype', 'hgnc_symbol',
    'Promoter_Gene_ID', 'Promoter_ID', 'start_position',
    'strand',
    // mirna_index
    'ensembl_gene_id', 'mir_id',
    // microbe_taxo
    'feature', 'taxo', 'taxo_id',
    // proteins
    'gene_id', 'protein_id',
    // custom
    'gene_locus',
    // error
    'Result',
  ]));
  if (indexCols.includes(colName)) {
    return cell;
  }
  return parseFloat(cell).toFixed(2);
}

export function beautifyGeneLocus (
  chromosomeName,
  startPosition,
  endPosition,
) {
  try {
    if (!(chromosomeName && startPosition && endPosition)) {
      return 'N/A';
    }
    const locus = String(chromosomeName).toUpperCase()
      + ':'
      + parseInt(startPosition)
      + '-'
      + parseInt(endPosition);
    return locus;
  } catch (e) {
    return 'N/A';
  }
}

export function beautifyStrand (strand) {
  try {
    const strandIdx = parseFloat(strand);
    if (strandIdx === 1) {
      return '+';
    }
    if (strandIdx === -1) {
      return '-';
    }
    return 'N/A';
  } catch (e) {
    return 'N/A';
  }
}
