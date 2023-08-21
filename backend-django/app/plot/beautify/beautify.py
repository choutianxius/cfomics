import pandas as pd
import re
def beautify(element):
    if isinstance(element, str):
        element = element.lower()
        if re.search(r'gse.*|pxd.*|msv.*|prjeb.*|prjna.*|srp.*|srr.*',element):
            return element.upper()
    else:
        return element
    # omics
    if element == 'cfdna':
        return 'cfDNA'
    elif element == 'cfrna':
        return 'cfRNA'
    elif element == 'pro':
        return 'Proteome'
    elif element == 'protein':
        return 'Protein'
    elif element in ['metabolite','met']:
        return 'Metabolite'
    # entity
    elif element == 'gene':
        return 'Genes'
    elif element == 'promoter':
        return 'Promoters'
    elif element == 'cgi':
        return 'CpG Islands'
    elif element == 'bin':
        return 'Bins'
    elif element == '4mer':
        return '4-mer Motif'
    elif element == '0':
        return 'Whether Classified'
    elif element == 'c':
        return 'Class'
    elif element == 'd':
        return 'Domain'
    elif element == 'f':
        return 'Family'
    elif element == 'g':
        return 'Genus'
    elif element == 'k':
        return 'Kingdom'
    elif element == 'o':
        return 'Order'
    elif element == 'p':
        return 'Phylum'
    elif element == 's':
        return 'Species'
    elif element == 'o':
        return 'Order'
    elif element == '15t5':
        return 'Region: -150~TSS~50bp'
    elif element == '31e1':
        return 'Region: 300~100bp upstream Exon1'
    elif element == 'entity':
        return 'Entities'
    elif element == 'met':
        return 'Metabolite'
    # feature
    elif element == 'bsseq':
        return 'Methylation (BS-seq)'
    elif element == 'dipseq':
        return 'Methylation (DIP-seq)'
    elif element == 'endmotif':
        return 'End Motif'
    elif element == 'fragsize':
        return 'Fragment Size'
    elif element == 'microbe':
        return 'Microbe'
    elif element == 'no':
        return 'Nucleosomal Occupancy'
    elif element == 'altp':
        return 'Alternative Promoter'
    elif element == 'apa':
        return 'Alternative Poly-adenylation'
    elif element == 'chim':
        return 'Chimeric RNA'
    elif element == 'edit':
        return 'RNA Editing'
    elif element == 'expr':
        return 'Expression'
    elif element == 'snp':
        return 'RNA SNP'
    elif element == 'splc':
        return 'RNA Splicing'
    elif element == 'te':
        return 'Transposal Element'
    elif element == 'itst':
        return 'Intensity'
    elif element == 'area':
        return 'Area of Peak'
    # specimen
    elif element in ['plasma', 'serum', 'blood', 'urine']:
        return element.capitalize()
    elif element == 'csf':
        return 'Cerebrospinal Fluid (CSF)'
    elif element == 'pbmc':
        return 'Peripheral Blood Mononuclear Cell (PBMC)'
    elif element == 'ev':
        return 'Extracellular Vesicles (EV)'
    elif element == 'unknown':
        return 'Unknown'
    elif element == 'tep':
        return 'Tumour-educated Platelets (TEP)'
    elif element == 'cec':
        return 'Circulating Epithelial Cell (CEC)'
    elif element == 'ctc':
        return 'Circulating Tumor Cells (CTC)'
    elif element == 'rbc':
        return 'Red Blood Cell'
    elif element == 'sputum':
        return 'Sputum'
    elif element == 'rinse':
        return 'Mouse Rinse'
    # disease
    elif element in ['crc', 'mm', 'uc', 'sarc', 'rcc', 'mel', 'hl', 'hnc', 'ec', 'ccc', 'mb', 'eac', 'escc', 'gc', 'lihc', 'pdac', 'luca', 'cll', 'dlbc', 'prad', 'laml', 'brca', 'gbm', 'paad', 'thca', 'kirc', 'oc']:
        return element.upper()
    elif element == 'ct' or element == 'ctrl': #应当统一成第一个 done
        return 'Control'
    elif element == 'mean':
        return 'Mean value'
    elif element == 'firefighter':
        return 'Firefighter'
    elif element == 'ct_hp':
        return 'Hydrocephalus patient'
    elif element == 'cf':
        return 'Cystic Fibrosis'
    elif element == 'ct_pd':
        return 'Pancreatic Disease'
    elif element == 'ct_cd':
        return 'Crohn\'s disease'
    elif element == 'ct_bd':
        return 'Bowel Disease'
    elif element == 'ct_e':
        return 'Epilepsy'
    elif element == 'ct_uc':
        return 'Ulcerative Colitis'
    elif element == 'ct_nstemi':
        return 'Non-ST-Elevation Myocardial Infarction'
    elif element == 'ct_ms':
        return 'Multiple Sclerosis'
    elif element == 'ct_gh':
        return 'Hematuria'
    elif element == 'ct_ap':
        return 'Angina Pectoris'
    elif element == 'ct_ph':
        return 'Pulmonary Hypertension'
    elif element == 'ct_sap':
        return 'Stable Angina Pectoris'
    elif element == 'ct_uap':
        return 'Unstable Angina Pectoris'
    elif element == 'ct_as':
        return 'Atherosclerosis'
    elif element == 'ct_lc':
        return 'Liver cirrhosis'
    elif element == 'ct_bll':
        return 'Benign liver lesions'
    elif element == 'ct_chb':
        return 'Chronic Hepatitis B virus'
    elif element == 'ct_hc' or element == 'ctrl_hc' or element == 'hc': #应当统一成第一个 done
        return 'Healthy'
    elif element == 'ct_hbvc' or element == 'ctrl_hbvc' or element == 'hbvc': #应当统一成第一个 done
        return 'HBV carrier'
    elif element == 'ct_hbvlc':
        return 'HBV Cirrhosis'
    elif element == 'ct_dsvscrc':
        return 'Corresponding Disease of CRC'
    elif element == 'ct_dsvsgc':
        return 'Corresponding Disease of GC'
    elif element == 'ct_dsvslihc':
        return 'Corresponding Disease of LIHC'
    elif element == 'ct_dsvspaad':
        return 'Corresponding Disease of PAAD'
    elif element == 'ct_dsvsthca':
        return 'Corresponding Disease of THCA'
    elif element == 'ct_cp':
        return 'Chronic Pancreatitis'
    elif element == 'spontaneouslypreterm':
        return 'Spontaneously Preterm'
    elif element == 'ct_cld':
        return 'Chronic liver Disease'
    elif element == 'brca_no_metastatic':
        return 'BRCA without Metastatic'
    elif element == 'lcc_vs_normal':
        return 'LCC vs. Normal'
    elif element == 'lcc_vs_pbs':
        return 'LCC vs. PBS Normal'
    elif element == 'normal_vs_pbs':
        return 'Normal vs. PBS Normal'
    elif element == 'rcc_vs_lcc':
        return 'RCC vs. LCC'
    elif element == 'rcc_vs_normal':
        return 'RCC vs. Normal'
    elif element == 'rcc_vs_pbs':
        return 'RCC vs. PBS Normal'
    elif element == 'hc_nobrca1_2':
        return 'Healthy without BRCA1/2 carriers'
    elif element == 'hc_withbrca1_2':
        return 'Healthy with BRCA1/2 carriers'
    elif element == 'oc_withbrca1_2':
        return 'OC with BRCA1/2 carriers'
    elif element == 'oc_nobrca1_2':
        return 'OC without BRCA1/2 carriers'
    elif element == 'pooling':
        return 'Pooling'
    elif element == 'brca_withnct':
        return 'BRCA after NCT'
    elif element == 'full_term':
        return 'Full term'
    elif element == 'brca_lymph_node_metastatic':
        return 'BRCA with lymph node metastatic'
    elif element == 'udn':
        return 'Proband'
    elif element == 'blank':
        return 'Blank'
    elif element == 'ph':
        return 'Pitt Hopkins Disease'
    # value
    elif element == 'beta':
        return 'Beta Value'
    elif element == 'tpm_5hmc':
        return 'TPM (5hmC)'
    elif element == 'tpm_5mc':
        return 'TPM (5mC)'
    elif element == 'tpm':
        return 'TPM'
    elif element == 'motifratio':
        return 'Proportion of Motifs'
    elif element == 'ratio':
        return 'Ratio of short fragment to long fragment'
    elif element == 'ra':
        return 'Relative Abundance'
    elif element == 'noratio':
        return 'Nucleosome-occupancy Ratio'
    elif element == 'count':
        return 'Read Count'
    elif element == 'pdui':
        return 'PDUI'
    elif element == 'editratio':
        return 'Editing Ratio'
    elif element == 'snpratio':
        return 'SNP Ratio'
    elif element == 'iclv':
        return 'IncLevel'
    elif element == 'itst':
        return 'Intensity'
    elif element == 'area':
        return 'Area of Peak'
    # others
    elif element == 'cancer':
        return 'Cancers'
    elif element == 'non-cancer':
        return 'Non-cancers'
    else:
        return element

def beautify_table(table, reset_col=True, reset_index=True):
    if reset_col:
        table.columns = [beautify(col) for col in list(table.columns)]
    if reset_index:
        table.index = [beautify(ind) for ind in list(table.index)]
    table = table.applymap(beautify)
    return table

def beautify_series(series):
    series = series.apply(beautify)
    return series
