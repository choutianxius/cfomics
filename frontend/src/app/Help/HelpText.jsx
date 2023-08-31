/* eslint-disable max-len */
/* eslint-disable react/jsx-one-expression-per-line */
import { MathJax } from 'better-react-mathjax';
import React from 'react';
import { Link } from 'react-router-dom';
import { nanoid } from 'nanoid';

function Bold ({ children }) {
  return (
    <span style={{ fontWeight: 'bold' }}>
      {children}
    </span>
  );
}

function Light ({ children }) {
  return (
    <span style={{ fontWeight: 'lighter' }}>
      {children}
    </span>
  );
}

function Italic ({ children }) {
  return (
    <span style={{ fontStyle: 'italic', fontFamily: 'serif' }}>
      {children}
    </span>
  );
}

function BoldItalic ({ children }) {
  return (
    <span style={{ fontWeight: 'bold', fontStyle: 'italic', fontFamily: 'serif' }}>
      {children}
    </span>
  );
}

export const OverviewPart1 = (
  <p className="px-4">CfOmics is a comprehensive multiomics database focusing
    on multiple cancers in human fluid based on high-throughput sequencing data,
    including cfDNA, cfRNA, circulating tumor cells (CTC), extracellular
    vesicles (EV) and other types. This database contains 28 cancers
    (THCA, PRAD, PDAC, PAAD, MB, LUCA, LIHC, LAML, KIRC, GC, GBM, ESCC, EAC, DLBC,
    CRC, CLL, BRCA, OC etc) and their corresponding control data. It also includes 17 feature types
    (single nucleotide polymorphism (SNP), splicing, methylation, alternative
    polyadenylation (APA), alternative promoter, microbe, chimeric RNA,
    transposable element (TE), RNA editing, insert size, expression, MS of proteome &
    metabolome etc) and biomarker data, allowing users to search information and perform
    related analysis operations at multiple levels.This database supports the display
    of multiomics data using genome browser as a tool, and supports the mapping of
    data profiles and significance analysis for each gene and cancer type.It can
    promote the exploration of cancer biomarker based on the multi group analysis of body fluid
    data, and promote the research in the field of cancer diagnosis and treatment.
  </p>
);

export const BrowsePart1 = (
  <>
    <p className="px-4 my-0">
      1. Select molecular type
    </p>
    <p className="px-4 my-0">
      2. First select a Feature Type, then available options for the following drop-downs will
      automatically update. After selection of every row is done, press Confirm
    </p>
  </>
);

export const BrowsePart2 = (
  <>
    <p className="px-4 my-0">
      1. Select available datasets
    </p>
    <p className="px-4 my-0">
      2. Leads to the Download page, can download entire datasets in bulk(Optional)
    </p>
  </>
);

export const BrowsePart3 = (
  <>
    <p className="px-4 my-0">
      1. Press the column names to sort table
    </p>
    <p className="px-4 my-0">
      2. Link to details and analysis for this specific gene&#40;
      for more information, please refer to:
      &nbsp;<a href="#analysis">Analysis for Genes, Microbes and End Motifs</a>
      &nbsp;section&#41;
    </p>
    <p className="px-4 my-0">
      3. Controls for table navigation
    </p>
    <p className="px-4 my-0">
      4. Download this dataset(Optional)
    </p>
  </>
);

export const BrowsePart4 = (
  <>
    <p className="px-4 my-0">
      This End-Motif Profile section is shown below the dataset table,
      displayed when Feature Type: End Motif is selected
    </p>
    <p className="px-4 my-0">
      1. Select 2-mer, 3-mer or 4-mer dataset for visualization
    </p>
    <p className="px-4 my-0">
      2. Scroll through different viewable features, click
      a label to view/hide the feature
    </p>
  </>
);

export const BrowsePart5 = (
  <>
    <p className="px-4 my-0">
      This Microbe Profile section is shown below the dataset table,
      displayed when Feature Type: Microbe is selected
    </p>
    <p className="px-4 my-0">
      1. Scroll through different viewable features, click
      a label to view/hide the feature
    </p>
  </>
);

export const SearchPart1 = (
  <>
    <p className="px-4 my-0">
      1. Select datatype
    </p>
    <p className="px-4 my-0">
      2. According to the specified datatype, input for database search
    </p>
    <p className="px-4 my-0">
      3. Refer to this section for example prompts
    </p>

  </>
);

export const SearchPart2 = (
  <>
    <p className="px-4 my-0">
      The search bar provides search suggestions based on user input
    </p>
    <p className="px-4 my-0">
      Selecting a specific gene will lead to the details and analysis page
    </p>
    <p className="px-4 my-0">
      For more information, please refer to:
      &nbsp;<a href="#analysis">Analysis for Genes, Microbes and End Motifs</a>
      &nbsp;section
    </p>
  </>
);

export const browseGene1 = (
  <>
    <p className="px-4 my-0">
      Make a selection before moving on to data visualization below.
      This selection section will update all the sections below it.
    </p>
    <p className="px-4 my-0">
      Select from left to right. After an option is selected, available
      options on the right will be updated automatically.  When all
      selections are done, press Confirm
    </p>
    <p className="px-4 my-0">
      Note: These options are automatically chosen if users are
      redirected to this page from the Browse page.
    </p>

  </>
);

export const browseGene2 = (
  <>
    <p className="px-4 my-0">
      This section shows how a feature of a gene performs in different disease conditions.
    </p>
    <p className="px-4 my-0">
      Hover over the graph to view details
    </p>
  </>
);

export const browseGene3 = (
  <p className="px-4 my-0">
    This section does comparisons across different disease conditions.
  </p>
);

export const browseGene4 = (
  <p className="px-4 my-0">
    This section displays the research papers that are related.
  </p>
);

export const browseGene5 = (
  <>
    <p className="px-4 my-0">
      This section is used for displaying multi-omics information.
    </p>
    <p className="px-4 my-0">
      The menu on the left allows for data type, disease and sample
      selection. The selected sample will be displayed on the track.
    </p>
    <p className="px-4 my-0">
      All the selected samples will be marked on the bottom left
      of this section. Uncheck the sample to remove it from the track.
    </p>

  </>
);

export const browseGene6 = (
  <>
    <p className="px-4 my-0">
      This section is used for performing correlation analysis on 2 different features.
      The graphs on the top and right side shows data distribution.
    </p>
    <p className="px-4 my-0">
      1. Select 2 different features and the corresponding specimen. Then press Draw.
    </p>
    <p className="px-4 my-0">
      2. Click a label to view/hide the disease from graphs
    </p>

  </>
);

export const DataProcessingPart1 = (
  <>
    <p className="px-4">
      Our dataset includes multiple types of biological information, such as
      cfDNA, cfRNA, proteins, and metabolites. Each type of information has
      its unique meaning and display format, therefore we have employed
      different processing methods to account for these differences.
    </p>
    <p className="px-4">
      This is a detailed overview of our comprehensive data processing pipeline:
    </p>
  </>

);

export const BetaValuePart1 = (
  <p className="px-4">
    The beta value is a measure of DNA methylation that describes the ratio
    of the intensity of methylated cytosine to the sum of the intensities
    of both methylated and unmethylated cytosines at a specific CpG site.
    In other words, a beta value of 0 means that the CpG site is unmethylated,
    while a beta value of 1 means that it is completely methylated. Beta values
    can range from 0 to 1, and they provide a continuous measure of DNA methylation
    levels at a specific CpG site. This can be useful for comparing
    methylation levels at different CpG sites or for tracking changes in
    methylation levels over time.

    By the way, it is common to add an offset when calculating the beta
    value for a CpG site, because this can help to correct for technical artifacts
    and other sources of noise in the data.
  </p>
);

export const BetaValuePart2 = (
  <p className="px-4">
    Where <BoldItalic>M</BoldItalic> stands for the number methylated cytosine,
    and <BoldItalic>U</BoldItalic> stands for the number of unmethylated cytosine.

    In here, we calculate the mean bata values of all cytosines
    within a region to get the beta value of that
    region.
  </p>
);

export const TPMPart1 = (
  <p className="px-4">
    TPM stands for &quot;transcripts per million&quot; and is a measure of the
    relative abundance of a particular gene(region) in a sample. It is
    commonly used in the field of gene expression analysis to compare the
    levels of expression of different genes in a sample, and we expand it
    to other features such as normalized read count of data from MeDIP-seq.
    To calculate TPM, the number of reads of a particular gene(region) in a
    sample is first counted, and then this value is normalized by the length of genes,
  </p>
);
export const TPMPart2 = (
  <p className="px-4">
    and then the total number of reads in the sample and multiplied by
    one million. This gives the number of reads of the gene(region) per
    million reads in the sample, which is the TPM value.
  </p>
);

export const TPMPart3 = (
  <p className="px-4">TPM values are useful because they allow researchers to compare the
    levels of different genes(region) in a sample on a common scale, and they can also be used to
    compare levels between different samples.
  </p>
);

export const RelativeAbundancePart1 = (
  <p className="px-4">
    This type of value is calculated from the origin abundance value, which
    corresponds to the second column of kraken2 report
    file: <Bold>number of fragments covered on this clade</Bold>,
    representing the number of reads covering a taxonomy.

    To calculate the <Italic>relative</Italic> abundance,
    we shall get the <Italic>origin</Italic> abundance matrix first, like:
  </p>
);

export const RelativeAbundancePart2 = (
  <p className="px-4">
    Then, the <Italic>origin</Italic> abundance is divided by the sum of every
    corresponding samples, which is got by summing up values of every samples, and you can
    get the <Italic>relative</Italic> abundance.
  </p>
);

export const RelativeAbundancePart3 = (
  <p className="px-4">
    Besides, before calculating, microbe data in this database has been filtered for
    deliminating possible contaminating genus according to
    an <Link to="https://elifesciences.org/articles/75181/figures" target="_blank">article</Link>:
    <Italic> Cancer type classification using plasma
      cell-free RNAs derived from human and microbes.
    </Italic>
  </p>
);

export const PDUIPart1 = (
  <p className="px-4">The percentage of distal polyA site usage index (ΔPDUI) is a
    measure of the relative usage of a polyadenylation (polyA) site. PolyA sites are sequences
    of DNA located near the end of a gene that are recognized by enzymes called polyadenylate
    polymerases. These enzymes add a stretch of adenine nucleotides (polyA tail) to the end of
    the gene&apos;s RNA transcript, which helps to stabilize and protect the transcript. The ΔPDUI
    is calculated by comparing the usage of a particular polyA site to the usage of the most
    commonly used polyA site (or distal polyA site, which refers to the end point of the longest
    3&apos; UTR among all the samples) within the same gene. A ΔPDUI value of 100% indicates that
    the polyA site being measured is the most commonly used one (or the distal one), while a
    value of 0% indicates that it is not used at all. The use of different polyA sites can
    have significant effects on the expression of a gene and its encoded protein.

    The following formula is used to calculate it:
  </p>
);

export const PDUIPart2 = (
  <p className="px-4">
    <MathJax>
      where {'\\(w_{L}^{i*}\\)'} and {'\\(w_{S}^{i*}\\)'} are the estimated
      expression levels of transcripts with distal and
      proximal (or a particular polyA site) polyA sites
      for sample <Italic>i</Italic>.
    </MathJax>
  </p>
);

export const IclvPart1 = (
  <p className="px-4">Inclevel, another term for exon inclusion level, refers to
    the proportion of transcripts of a gene that include a particular exon. An exon is a
    segment of a gene&apos;s DNA sequence that is transcribed into RNA and then translated into
    protein. Not all exons in a gene are always included in the final RNA transcript;
    some may be skipped, or alternatively spliced, during the process of RNA splicing.
    The exon inclusion level can be affected by various factors, such as the presence of
    regulatory elements or mutations within the exon, and can have important effects on
    the expression and function of the encoded protein.
  </p>
);

export const IclvPart2 = (
  <>
    <p className="px-4">
      <Italic>I</Italic>: reads number mapped to exon inclusion isoform; &nbsp;
      <Italic>li</Italic>: effective length of exon inclusion isoform.
    </p>
    <p className="px-4">
      <Italic>S</Italic>: reads number mapped to exon skipping isoform;  &nbsp;
      <Italic>lS</Italic>: effective length of exon skipping isoform.
    </p>

    <p className="px-4">
      To be brief, the effective length in rMATS refers specifically to
      the length of the coding region plus any included UTRs, and does
      not include excluded exons or introns.
    </p>
  </>
);

export const EditingRatioPart1 = (
  <>
    <p className="px-4">
      RNA editing is a process in which the sequence of an RNA
      molecule is altered after it has been transcribed from DNA. This can be done through
      various mechanisms, such as the insertion, deletion, or substitution of nucleotides
      in the RNA molecule. The editing ratio at a particular site is calculated by dividing
      the number of edited transcripts at that site by the total number of transcripts.
    </p>
    <p className="px-4">
      For example, if 100 transcripts were generated from a gene, and 20 of them were edited
      at a specific site, the editing ratio at that site would be 20%. RNA editing can have
      important effects on the expression and function of the encoded protein, and the editing
      ratio can provide valuable information about the prevalence and significance of RNA
      editing at a particular site.
    </p>
  </>
);

export const SNPRatioPart1 = (
  <>
    <p className="px-4">SNP ratio here describes the SNP fluency of a single site.
      It can be calculated by dividing the number of reads with a specific alternative
      nucleotide compared to the reference genome covering the site by the total number of
      reads covering it.
    </p>
    <p className="px-4">For example, if 100 reads were covering the site chr1_631862_G_A, and 80 of them were A,
      which was different from the genome G, the SNP ratio at that site would be 0.8. The
      high SNP ratio suggests that this site is a common location for SNPs within the gene or
      sample, and may have significant effects on the expression and function of the gene. It
      would be important to further analyze the site and its surrounding sequence to better
      understand the potential consequences of the SNPs at this site.
    </p>
  </>
);

export const MotifRatioPart1 = (
  <>
    <p className="px-4">
      Based on: &nbsp;
      <Italic>2020, Cancer Discov, Plasma DNA End-Motif Profiling as a
        Fragmentomic Marker in Cancer, Pregnancy, and Transplantation
      </Italic>
    </p>
    <p className="px-4">This kind of ratio value type represents the percentage of reads with a
      specific motif among all reads of a sample. The end motif of DNA reads is
      a sequence of nucleotides that appears at the end of a DNA read. The ratio
      of the end motif can provide information about the characteristics of the DNA
      sample, such as the length of the reads and the overall structure of the genome.
    </p>
  </>
);

export const NoRatioPart1 = (
  <>
    <p className="px-4">
      Based on: &nbsp;
      <Italic>
        2021, NC, Tissue-specific cell-free DNA degradation quantifies
        circulating tumor DNA burden
      </Italic>
    </p>

    <p className="px-4">
      Nucleosome occupancy data from cell-free DNA can be measured using
      different techniques, as cell-free DNA is fragmented inside the circulating system.
      DNA fragments are then sequenced and analyzed to determine the distribution
      of nucleosomes along the genome.
    </p>

    <p className="px-4">In this database, the nucleosome-occupancy ratio of these 2 kinds of target
      regions were calculated:
    </p>

    <ul className="px-6">
      <li key={nanoid()} style={{ listStylePosition: 'inside' }}>-150~TSS~50bp</li>
      <li key={nanoid()} style={{ listStylePosition: 'inside' }}>upstream300~100bp relative to exon1</li>
    </ul>

    <p className="px-4">Firstly, calculate the coverage of the above regions.</p>
    <p className="px-4">
      Then, for every kinds of target regions, calculate coverage of the
      following corresponding regions as control:
    </p>

    <ul className="px-6">
      <li key={nanoid()} style={{ listStylePosition: 'inside' }}>for -150~TSS~50bp: </li>
      <ul>
        <li key={nanoid()} style={{ listStylePosition: 'inside' }}>upstream -2000~-1000bp relative to TSS; </li>
        <li key={nanoid()} style={{ listStylePosition: 'inside' }}>downstream 1000~2000bp relative to TSS</li>
      </ul>
      <li key={nanoid()} style={{ listStylePosition: 'inside' }}>for 300~100bp upstream exon1:</li>
      <ul>
        <li key={nanoid()} style={{ listStylePosition: 'inside' }}>upstream -2000~-1000 relative to exon1; </li>
        <li key={nanoid()} style={{ listStylePosition: 'inside' }}>downstream 1000~2000bp relative to exon1</li>
      </ul>
    </ul>

    <p className="px-4">and then divide the coverage of target regions by mean coverage
      of the upstream and downstream  control regions. After that,
      compare the value with 2, keep the minimal one.
    </p>
  </>
);

export const NoRatioPart2 = (<p className="px-4">0.01 is added for preventing 0 denominator.</p>);

export const fragsizeRatioPart1 = (
  <>
    <p className="px-4">Based on: &nbsp;
      <Italic>2019, Nat, Genome-wide cell-free DNA fragmentation in patients
        with cancer
      </Italic>
    </p>

    <p className="px-4">Fragmentomics is a term that refers to the study of the fragmentation
      patterns of DNA molecules. In the context of cell-free DNA, fragmentomics
      involves analyzing the fragmentation patterns of cell-free DNA in order
      to understand its characteristics and potential uses. And fragsize ratio
      is used to describe such feature.
    </p>

    <p className="px-4">Calculation process is as follows:</p>
    <ul className="px-6">
      <li key={nanoid()} style={{ listStylePosition: 'inside' }}>Based on the alignment file, the alignment information of long
        fragments (151-220nt) and short fragments (100-150nt) is
        extracted respectively.
      </li>
      <li key={nanoid()} style={{ listStylePosition: 'inside' }}>Based on the alignment information of long fragments and short
        fragments respectively, calculate the number of coverage on the
        genome bin, and then calculate the average.
      </li>
      <li key={nanoid()} style={{ listStylePosition: 'inside' }}>All coverage numbers are standardized under one sample.</li>
      <li key={nanoid()} style={{ listStylePosition: 'inside' }}>Calculation ratio: short / long.</li>
    </ul>
  </>
);

export const RAProteinPart1 = (
  <>
    <p className="px-4">
      For the calculation of the intensity of proteins, Mascot version 2.8 (60) was applied to
      process the raw mass spectrometry (MS) data with the following parameter settings: false
      discovery rate (FDR) of 0.05, precursor mass tolerance of 20 ppm, fragment tolerance of
      0.05 Da, number of tryptic termini (NTT) of 2, maximum missed cleavage of 2, and fixed
      modification of carbamidomethyl on Cysteine. The MS/MS spectra were searched against the
      UniProt human protein database (version of November 3, 2022), which contained 20,401
      protein entries. PANDA (61) was applied to calculate protein intensities based on
      label-free or labeled quantification.
    </p>

    <p className="px-4"><Bold>Label-free quantification</Bold></p>

    <p className="px-4">The label-free quantification method includes four steps:</p>
    <ul className="px-6">
      <li key={nanoid()} style={{ listStylePosition: 'inside' }}>Three types of information, mass-to-charge ratio (m/z), retention
        time (RT) and isotope intensity (Figure 1), are obtained from
        extracted ion chromatograms (XICs).
      </li>
      <li key={nanoid()} style={{ listStylePosition: 'inside' }}>Retention time (RT) alignment, cross search, normalization and
        peptide identification.
      </li>
      <li key={nanoid()} style={{ listStylePosition: 'inside' }}>The XIC peak area is used for peptide quantification (the area
        below the green line in Figure 1).
      </li>
      <li key={nanoid()} style={{ listStylePosition: 'inside' }}>We assume that peptides from the same protein have different weights.
        Therefore, protein abundance is calculated as the weighted average
        intensity of all peptides using the one-step Tukey’s biweight algorithm.
        The weight of each peptide is defined as the distance between the
        intensity of that peptide and the median intensity of all peptides.
      </li>
    </ul>
  </>
);

export const RAProteinPart2 = (
  <>
    <p className="px-4"><Bold>Figure 1.</Bold> Three-dimensional structure of mass spectrometry data.
    </p>

    <p className="px-4"><Bold>Labeled quantification</Bold></p>

    <p className="px-4">Tandem mass tag (TMT) labeling is applied for labeled quantification. Different
      from label-free quantification, TMT-based quantification uses reporter ion
      intensities to estimate peptide quantification values, which has been shown
      to afford higher precision than XIC-based quantitation.
    </p>
    <p className="px-4">TMT-based quantitative proteomic analysis includes four steps: 1) secondary
      spectrum preprocessing, 2) reporter ion extraction and correction, 3)
      normalization, and 4) peptide quantification. Finally, the one-step Tukey&apos;s
      biweight algorithm is used to calculate protein abundance, similar to
      label-free quantification.
    </p>
    <p className="px-4">
      <Light>1. Chang, C., et al. PANDA: A comprehensive and flexible tool for quantitative
        proteomics data analysis. Bioinformatics 35, 898-900 (2019).
      </Light>
    </p>
  </>
);

export const RAMetabolitePart1 = (
  <>
    <p className="px-4"><Bold>Quantitative metabolomics analysis</Bold></p>

    <p className="px-4">The acquired raw data were converted to mzML format using
      MSConvert (62) and then processed using MS-DIAL version 5.10 (63), which
      includes data collection, peak detection, compound identification, and
      peak alignment. Data collection was performed with the following parameter
      settings: MS1 tolerance = 0.01 Da, MS2 tolerance = 0.025 Da, Retention
      time = 0-100 min, MS1 mass range = 0-2000 Da.
    </p>

    <p className="px-4">In MS-DIAL, the base peak chromatogram is extracted for each mass
      slice of 0.1 m/z with a step size of 0.05 m/z. MS-DIAL uses smoothing methods
      (the linearly weighted smoothing average as default), differential calculus,
      and noise estimations to detect peak tops and two edges from the base peak
      chromatograms. The peak intensity is then measured by peak height or area.
      The detected peak tops are shown as ‘spots’ in a spot plot with retention
      time (min) and MS1 data (m/z) axes. The retention time and base peak m/z of
      each peak spot are used for metabolite identification, while the peak
      intensity is used to represent the intensity of metabolites in the database.
    </p>

    <p className="px-4">Metabolite identification is carried out by searching the
      MS-DIAL metabolomics MSP spectral kits (All public MS/MS libraries) to match
      the obtained mass spectra with reference spectra of compounds. Four scores,
      namely RT similarity, MS1 similarity, isotope ratio similarity, and MS/MS
      similarity, were calculated based on retention time, accurate mass, isotope
      ratio, and MS/MS spectrum information. Each score was standardized to a
      range from 0 to 1, meaning no similarity and a perfect match, respectively.
      A weighted average of the four scores is used for compound identification.
    </p>

    {/*
    <p className="px-4">The workflow consists of seven steps:
    </p>
    <ul className="px-6">
      <li key={nanoid()} style={{ listStylePosition: 'inside' }}><Bold>Mass detection.</Bold> The mass detection module generates a mass list (i.e., list of m/z values and corresponding signal intensities) for each scan in each raw data file. During mass detection, raw profile data are centroided, and noise filtering is performed based on a user-defined threshold.
      </li>
      <li key={nanoid()} style={{ listStylePosition: 'inside' }}><Bold>Chromatogram building.</Bold> The ADAP chromatogram builder module builds an extracted-ion chromatogram (EIC) for each m/z value that was detected over a minimum number of consecutive scans in the LC‒MS run. Each data file is processed individually. The mass list associated with each MS1 scan in a data file is taken as input, and a feature list is returned as output.
      </li>
      <li key={nanoid()} style={{ listStylePosition: 'inside' }}><Bold>Feature resolution.</Bold> During EIC building, overlapping and partially co-eluting features are retained as single features in the feature list. As a local minimum in the EIC trace might correspond to the valley between two adjacent, partially resolved peaks, the Local minimum resolver utilizes such minima to split &quot;shoulder&quot; LC peaks into individual features.</li>
      <li key={nanoid()} style={{ listStylePosition: 'inside' }}><Bold>13C isotope filter (isotope grouper).</Bold> Signals generated by isotopologues of the same chemical entity are detected as distinct features and included in the feature lists, representing redundant information for the downstream data analysis. This issue ordinarily occurs for C-containing molecules, where the 13C isotope signals can be easily detected. The 13C isotope filter module aims at filtering out the features corresponding to the 13C isotopes of the same analyte. The algorithm considers each feature individually and checks for the presence of potential 13C-related peak(s) in the feature lists.</li>
      <li key={nanoid()} style={{ listStylePosition: 'inside' }}><Bold>Feature alignment.</Bold> Feature alignment enables the alignment of corresponding features across all samples. The join aligner module aligns detected peaks in different samples through a match score. The score is calculated based on the mass and retention time of each peak and ranges of tolerance stipulated in the parameter setup dialog.</li>
      <li key={nanoid()} style={{ listStylePosition: 'inside' }}><Bold>Gap-filling.</Bold> The absence of features in some samples can either reflect the truth - the metabolite is absent in the given sample, or it can be due to data preprocessing. To account for this, gap filling is applied in this step. Gap-filling can be performed on the aligned feature lists to cope with missing features that might be artifacts of the feature-detection process.</li>
      <li key={nanoid()} style={{ listStylePosition: 'inside' }}><Bold>Spectral library search.</Bold> Spectral library search allows for the identification of metabolites by comparing the acquired spectra against a database of reference spectra. The reference spectra are obtained from the GNPS spectral library. During the search, the software compares the m/z values, retention times, and intensity patterns of the acquired spectra with those in the spectral library. A match score is assigned based on the similarity between the acquired spectrum and the reference spectrum. The higher the match score, the more likely the compound is present in the sample.</li>
    </ul>
    <p className="px-4">
      <Light>1.  Schmid R, Heuckeroth S, Korf A, et al. Integrative analysis of multimodal
        mass spectrometry data in MZmine 3[J]. Nat Biotechnol, 2023, 41(4): 447-449.
      </Light>
    </p>
  */}
  </>
);

export const RAMetabolitePart2 = (
  <p className="px-4">The peak alignment algorithm in MS-DIAL is derived from
    the Joint Aligner implemented in MZmine (64). It consists of four major
    steps: (1) making a reference table, (2) fitting each sample peak table
    to the reference peak table, (3) filtering aligned peaks and (4)
    interpolating missing values.
  </p>
);
