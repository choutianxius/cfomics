import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { nanoid } from 'nanoid';
import { React, useState } from 'react';

import * as text from './HelpText';
import './Help.css';
// import { ScrollSpyDiv } from './ScrollSpyDiv';
import { AccordionItem, openAccordionItem } from './AccordionItem';
import CollapsibleNav from './CollapsibleNav';

const { PUBLIC_URL } = process.env;

const structureChart = PUBLIC_URL + '/images/cfOmicsOverview.webp';
const browseImg1 = PUBLIC_URL + '/images/browse1.png';
const browseImg2 = PUBLIC_URL + '/images/browse2.png';
const browseImg3 = PUBLIC_URL + '/images/browse3.png';
const browseImg4 = PUBLIC_URL + '/images/browse4.png';
const browseImg5 = PUBLIC_URL + '/images/browse5.png';
const searchImg1 = PUBLIC_URL + '/images/search1.png';
const searchImg2 = PUBLIC_URL + '/images/search2.png';
const browseGeneImg1 = PUBLIC_URL + '/images/browse_gene1.png';
const browseGeneImg2 = PUBLIC_URL + '/images/browse_gene2.png';
const browseGeneImg3 = PUBLIC_URL + '/images/browse_gene3.png';
const browseGeneImg4 = PUBLIC_URL + '/images/browse_gene4.png';
const browseGeneImg5 = PUBLIC_URL + '/images/browse_gene5.png';
const browseGeneImg6 = PUBLIC_URL + '/images/browse_gene6.png';
const massSpectroData = PUBLIC_URL + '/images/RAProteinMetabolite_MassSpectroDataEng.png';
const dataProcessingPipeline = PUBLIC_URL + '/images/DataProcessingPipeline.webp';

const config = {
  loader: { load: ['[tex]/html'] },
  tex: {
    packages: { '[+]': ['html'] },
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)'],
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\{', '\\}'],
    ],
  },
};

export default function Help () {
  const [overviewOpen, setOverviewOpen] = useState(true);
  const [browseOpen, setBrowseOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(true);
  const [browseGeneCancersOpen, setBrowseGeneCancersOpen] = useState(true);
  const [nomenclatureOpen, setNomenclatureOpen] = useState(true);
  const [pipelineOpen, setPipelineOpen] = useState(true);
  return (
    <div id="cfomics-tutorial-main">
      <MathJaxContext version={3} config={config}>
        <div className="sidebar">
          <h3 className="border-2 border-bottom py-3 mb-3">Contents</h3>
          <div className="cfomics-tutorial-aside overflow-scroll">
            <nav id="side-nav" className="nav nav-pills flex-columns small">
              <a className="nav-link w-100" href="#page-top" onClick={openAccordionItem} data-bs-target="#overview-collapseButton"><h5>Overview</h5></a>
              <a className="nav-link w-100" href="#browse" onClick={openAccordionItem} data-bs-target="#browse-collapseButton"><h5>Browse</h5></a>
              <a className="nav-link w-100" href="#search" onClick={openAccordionItem} data-bs-target="#search-collapseButton"><h5>Search</h5></a>
              <a className="nav-link w-100" href="#analysis" onClick={openAccordionItem} data-bs-target="#analysis-collapseButton"><h5>Analysis</h5></a>
              <CollapsibleNav id="nomenclature-collapseNav" href="#nomenclature" onClick={openAccordionItem} accordionButton="#nomenclature-collapseButton" open={nomenclatureOpen} setOpen={setNomenclatureOpen}>
                <h5>Nomenclature</h5>
                <nav className="nav nav-pills flex-columns">
                  <a className="nav-link w-100" href="#nomenclature-cancer"><h6>Cancers</h6></a>
                  <a className="nav-link w-100" href="#nomenclature-other"><h6>Other Conditions</h6></a>
                  <a className="nav-link w-100" href="#nomenclature-valuesFeaturesIdentities"><h6>Values / Features / Entities</h6></a>
                </nav>
              </CollapsibleNav>

              <CollapsibleNav id="pipeline-collapseNav" href="#pipeline-collapseButton" onClick={openAccordionItem} accordionButton="#pipeline-collapseButton" open={pipelineOpen} setOpen={setPipelineOpen}>
                <h5>Feature Calculation</h5>
                <nav className="nav nav-pills flex-columns">
                  <a className="nav-link w-100" href="#pipeline-intro"><h6>Data processing</h6></a>
                  <a className="nav-link w-100" href="#pipeline-beta"><h6>Beta value</h6></a>
                  <a className="nav-link w-100" href="#pipeline-tpm"><h6>TPM</h6></a>
                  <a className="nav-link w-100" href="#pipeline-relativeAbundance"><h6>ra / Relative Abundance</h6></a>
                  <a className="nav-link w-100" href="#pipeline-pdui"><h6>PDUI</h6></a>
                  <a className="nav-link w-100" href="#pipeline-iclv"><h6>Inclv / Inclevel</h6></a>
                  <a className="nav-link w-100" href="#pipeline-editingRatio"><h6>Editing Ratio</h6></a>
                  <a className="nav-link w-100" href="#pipeline-snpRatio"><h6>SNP Ratio</h6></a>
                  <a className="nav-link w-100" href="#pipeline-motifRatio"><h6>Motif Ratio</h6></a>
                  <a className="nav-link w-100" href="#pipeline-noRatio"><h6>No Ratio / Nucleosome-occupancy ratio</h6></a>
                  <a className="nav-link w-100" href="#pipeline-fragsizeRatio"><h6>Fragsize ratio</h6></a>
                  <a className="nav-link w-100" href="#pipeline-raProtein"><h6>Relative abundance of protein</h6></a>
                  <a className="nav-link w-100" href="#pipeline-raMetabolite"><h6>Relative abundance of metabolite</h6></a>
                </nav>
              </CollapsibleNav>
            </nav>
          </div>
        </div>

        <div className="cfomics-tutorial-content ms-3 w-100" style={{ minHeight: '1000px' }}>
          {/* <ScrollSpyDiv data-bs-target="#side-nav"> */}
          <div className="accordion">
            <AccordionItem idName="overview" title="1. Overview of cfOmics" open={overviewOpen} setOpen={setOverviewOpen}>
              <div className="row justify-content-center">
                <div className="center-block w-75">
                  <img src={structureChart} alt="Overview" className="img-fluid" />
                </div>
                {text.OverviewPart1}
              </div>
            </AccordionItem>

            <div className="cfomics-horizontal-rule" />

            <AccordionItem idName="browse" title="2. Browse cfOmics" open={browseOpen} setOpen={setBrowseOpen}>
              <div className="row justify-content-center">
                <div className="center-block w-100">
                  <img src={browseImg1} alt="Browse" className="img-fluid" />
                </div>
                {text.BrowsePart1}
                <div className="cfomics-horizontal-rule" />
                <div className="center-block w-100">
                  <img src={browseImg2} alt="Browse" className="img-fluid" />
                </div>
                {text.BrowsePart2}
                <div className="cfomics-horizontal-rule" />
                <div className="center-block w-100">
                  <img src={browseImg3} alt="Browse" className="img-fluid" />
                </div>
                {text.BrowsePart3}
                <div className="cfomics-horizontal-rule" />
                <div className="center-block w-100">
                  <img src={browseImg4} alt="Browse" className="img-fluid" />
                </div>
                {text.BrowsePart4}
                <div className="center-block w-100">
                  <img src={browseImg5} alt="Browse" className="img-fluid" />
                </div>
                {text.BrowsePart5}
              </div>
            </AccordionItem>

            <div className="cfomics-horizontal-rule" />

            <AccordionItem idName="search" title="3. Search cfOmics" open={searchOpen} setOpen={setSearchOpen}>
              <div className="row justify-content-center">
                <div className="center-block w-100">
                  <img src={searchImg1} alt="Search" className="img-fluid" />
                </div>
                {text.SearchPart1}
              </div>
              <div className="row justify-content-center">
                <div className="center-block w-100">
                  <img src={searchImg2} alt="Search" className="img-fluid" />
                </div>
                {text.SearchPart2}
              </div>
            </AccordionItem>

            <div className="cfomics-horizontal-rule" />

            <AccordionItem
              idName="analysis"
              title="4. Analysis for Genes, Microbes and End Motifs"
              open={browseGeneCancersOpen}
              setOpen={setBrowseGeneCancersOpen}
            >
              <div className="row justify-content-center">
                <div className="center-block w-100">
                  <img src={browseGeneImg1} alt="Search" className="img-fluid" />
                </div>
                {text.browseGene1}
                <div className="cfomics-horizontal-rule" />
                <div className="center-block w-100">
                  <img src={browseGeneImg2} alt="Search" className="img-fluid" />
                </div>
                {text.browseGene2}
                <div className="cfomics-horizontal-rule" />
                <div className="center-block w-100">
                  <img src={browseGeneImg3} alt="Search" className="img-fluid" />
                </div>
                {text.browseGene3}
                <div className="cfomics-horizontal-rule" />
                <div className="center-block w-100">
                  <img src={browseGeneImg4} alt="Search" className="img-fluid" />
                </div>
                {text.browseGene4}
                <div className="cfomics-horizontal-rule" />
                <div className="center-block w-100">
                  <img src={browseGeneImg5} alt="Search" className="img-fluid" />
                </div>
                {text.browseGene5}
                <div className="cfomics-horizontal-rule" />
                <div className="center-block w-100">
                  <img src={browseGeneImg6} alt="Search" className="img-fluid" />
                </div>
                {text.browseGene6}
              </div>
            </AccordionItem>

            <div className="cfomics-horizontal-rule" />

            <AccordionItem idName="nomenclature" title="5. Nomenclature of cfOmics" open={nomenclatureOpen} setOpen={setNomenclatureOpen}>
              <article id="nomenclature-cancer">
                <h3 className="p-4">Cancers</h3>
                <div className="row justify-content-center">
                  <div className="col">
                    <table className="table table-responsive table-bordered table-hover table-sm w-100">
                      <thead>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="col">After Modification</th>
                          <th className="text-lg" scope="col">Full Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">BRCA</th>
                          <td className="text-lg">Breast cancer</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">CCC</th>
                          <td className="text-lg">Cholangiocarcinoma</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">CLL</th>
                          <td className="text-lg">
                            Chronic lymphocytic leukemia
                          </td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">CRC</th>
                          <td className="text-lg">Colorectal cancer</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">DLBC</th>
                          <td className="text-lg">
                            Diffuse large B-cell lymphoma
                          </td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">EAC</th>
                          <td className="text-lg">
                            Esophageal Adenocarcinoma
                          </td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">EC</th>
                          <td className="text-lg">
                            Endometrial Cancer
                          </td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">ESCC</th>
                          <td className="text-lg">
                            Esophageal squamous-cell carcinoma
                          </td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">GBM</th>
                          <td className="text-lg">
                            Glioblastoma
                          </td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">GC</th>
                          <td className="text-lg">
                            Gastric Cancer
                          </td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">HL</th>
                          <td className="text-lg">
                            Hodgkin Lymphoma
                          </td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">HNC</th>
                          <td className="text-lg">
                            Head and Neck Cancer
                          </td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">KIRC</th>
                          <td className="text-lg">
                            Kidney renal clear cell carcinoma
                          </td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">LAML</th>
                          <td className="text-lg">
                            Acute myeloid leukemia
                          </td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">LCC</th>
                          <td className="text-lg">
                            Left Colorectal Cancer
                          </td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">LIHC</th>
                          <td className="text-lg">
                            Liver Hepatocellular Carcinoma
                          </td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">LUCA</th>
                          <td className="text-lg">
                            Lung cancer
                          </td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">MB</th>
                          <td className="text-lg">
                            Medulloblastoma
                          </td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">MEL</th>
                          <td className="text-lg">
                            Melanoma
                          </td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">MM</th>
                          <td className="text-lg">
                            Multiple Myeloma
                          </td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">PAAD</th>
                          <td className="text-lg">
                            Pancreatic adenocarcinoma
                          </td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">PDAC</th>
                          <td className="text-lg">
                            Pancreatic ductal adenocarcinoma
                          </td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">PRAD</th>
                          <td className="text-lg">
                            Prostate Adenocarcinoma
                          </td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">THCA</th>
                          <td className="text-lg">
                            Thyroid Cancer
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </article>
              <article id="nomenclature-other">
                <h3 className="p-4">Other Conditions</h3>
                <div className="row justify-content-center">
                  <div className="col">
                    <table className="table table-responsive table-bordered table-hover table-sm w-100">
                      <thead>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="col">Abbreviations</th>
                          <th className="text-lg" scope="col">Full Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">AP</th>
                          <td className="text-lg">Angina Pectoris</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">AS</th>
                          <td className="text-lg">Atherosclerosis</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">BD</th>
                          <td className="text-lg">Bowel Disease</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">BLL</th>
                          <td className="text-lg">Benign Liver Lesions</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">CD</th>
                          <td className="text-lg">Crohn&apos;s Disease</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">CEC</th>
                          <td className="text-lg">Circulating Epithelial Cells</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">CHB</th>
                          <td className="text-lg">Chronic Hepatitis B Virus</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">CLD</th>
                          <td className="text-lg">Chronic Liver Disease</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">CP</th>
                          <td className="text-lg">Chronic Pancreatitis</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">CT</th>
                          <td className="text-lg">control</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">DS</th>
                          <td className="text-lg">corresponding disease</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">E</th>
                          <td className="text-lg">Epilepsy</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">GH</th>
                          <td className="text-lg">Hematuria</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">HBVC</th>
                          <td className="text-lg">HBV Carrier</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">HBVLC</th>
                          <td className="text-lg">HBV Cirrhosis</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">HC</th>
                          <td className="text-lg">healthy</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">HP</th>
                          <td className="text-lg">Hydrocephalus Patient</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">LC</th>
                          <td className="text-lg">Liver Cirrhosis</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">MS</th>
                          <td className="text-lg">Multiple Sclerosis</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">nSTEMI</th>
                          <td className="text-lg">Non-ST-Elevation Myocardial Infarction</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">PD</th>
                          <td className="text-lg">Pancreatic Disease</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">PH</th>
                          <td className="text-lg">Pulmonary Hypertension</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">SAP</th>
                          <td className="text-lg">Stable Angina Pectoris</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">UAP</th>
                          <td className="text-lg">Unstable Angina Pectoris</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">UC</th>
                          <td className="text-lg">Ulcerative Colitis</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </article>
              <article id="nomenclature-valuesFeaturesIdentities">
                <h3 className="p-4">Values / Features / Identities</h3>
                <div className="row justify-content-center">
                  <div className="col">
                    <table className="table table-responsive table-bordered table-hover w-100">
                      <thead>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="col">Abbreviations</th>
                          <th className="text-lg" scope="col">Full Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">15t5</th>
                          <td className="text-lg">promoter-150TSS50</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">31e1</th>
                          <td className="text-lg">promoter300100exon1end</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">splc</th>
                          <td className="text-lg">splicing</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">expr</th>
                          <td className="text-lg">expression</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">te</th>
                          <td className="text-lg">transposable element</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">no</th>
                          <td className="text-lg">nucleosome occupancy</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">noratio</th>
                          <td className="text-lg">nucleosome occupancy ratio</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">rbc</th>
                          <td className="text-lg">red blood cell</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">area</th>
                          <td className="text-lg">Area of Peak</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">itst</th>
                          <td className="text-lg">Intensity</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">iclv</th>
                          <td className="text-lg">IncLevel</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">CSF</th>
                          <td className="text-lg">Cerebrospinal Fluid</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">PBMC</th>
                          <td className="text-lg">Peripheral Blood Mononuclear Cell</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">EV</th>
                          <td className="text-lg">Extracellular vesicles</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">TEP</th>
                          <td className="text-lg">Tumor-educated Platelets</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">CEC</th>
                          <td className="text-lg">Circulating Epithelial Cells</td>
                        </tr>
                        <tr key={nanoid()}>
                          <th className="text-lg" scope="row">CTC</th>
                          <td className="text-lg">Circlulating Tumour Cells</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </article>
            </AccordionItem>

            <div className="cfomics-horizontal-rule" />

            <AccordionItem idName="pipeline" title="6. Specific description of value types" open={pipelineOpen} setOpen={setPipelineOpen}>
              <MathJaxContext>
                <article id="pipeline-intro">
                  <h3 className="p-4">Data Processing</h3>
                  {text.DataProcessingPart1}
                  <div className="row justify-content-center">
                    <div className="center-block w-75">
                      <img src={dataProcessingPipeline} alt="" className="img-fluid" />
                    </div>
                  </div>

                </article>
                <article id="pipeline-beta">
                  <h3 className="p-4">Beta value</h3>
                  {text.BetaValuePart1}
                  <div className="d-flex justify-content-center">
                    <MathJax>{'\\{beta = \\frac{M}{M+U+offset}\\}'}</MathJax>
                  </div>
                  {text.BetaValuePart2}
                  <div className="d-flex justify-content-center">
                    <MathJax>{'\\{beta_{region} = \\frac{1}{n}\\sum_{i=1}^{n}{\\beta_{cytosine}}_{i}\\}'}</MathJax>
                  </div>
                </article>

                <article id="pipeline-tpm">
                  <h3 className="p-4">TPM</h3>
                  {text.TPMPart1}
                  <div className="d-flex justify-content-center">
                    <MathJax>{'\\{RPK_i = \\frac{count_i}{(gene\\_length)_i}\\}'}</MathJax>
                  </div>
                  {text.TPMPart2}
                  <div className="d-flex justify-content-center">
                    <MathJax>{'\\{TPM_i = \\frac{RPK_i}{\\sum_{i=1}^{n}RPK_i}\\}'}</MathJax>
                  </div>
                  {text.TPMPart3}
                </article>

                <article id="pipeline-relativeAbundance">
                  <h3 className="p-4">ra / Relative Abundance</h3>
                  {text.RelativeAbundancePart1}
                  <div className="row justify-content-center">
                    <div className="col-auto">
                      <table className="table table-responsive table-bordered w-25">
                        <thead>
                          <tr key={nanoid()}>
                            <th scope="col">tax</th>
                            <th scope="col">sample1</th>
                            <th scope="col">sample2</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr key={nanoid()}>
                            <th scope="row">tax1</th>
                            <td>2</td>
                            <td>5</td>
                          </tr>
                          <tr key={nanoid()}>
                            <th scope="row">tax2</th>
                            <td>4</td>
                            <td>7</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {text.RelativeAbundancePart2}
                  <div className="d-flex justify-content-center">
                    <MathJax>{'\\{relative\\_abundance_{tax,sample} = \\frac{abundance_{tax,sample}}{\\sum_{tax,sample}abundance}\\}'}</MathJax>
                  </div>
                  {text.RelativeAbundancePart3}
                </article>

                <article id="pipeline-pdui">
                  <h3 className="p-4">PDUI</h3>
                  {text.PDUIPart1}
                  <div className="d-flex justify-content-center">
                    <MathJax>{'\\{PDUI = \\frac{w^{i*}_L}{w^{i*}_L+w^{i*}_S}\\}'}</MathJax>
                  </div>
                  {text.PDUIPart2}
                </article>

                <article id="pipeline-iclv">
                  <h3 className="p-4">Iclv / Inclevel</h3>
                  {text.IclvPart1}
                  <div className="d-flex justify-content-center">
                    <MathJax>{'\\{Inclevel=\\frac{\\frac{I}{lI}}{\\frac{I}{lI}+\\frac{S}{lS}}\\}'}</MathJax>
                  </div>
                  {text.IclvPart2}
                </article>

                <article id="pipeline-editingRatio">
                  <h3 className="p-4">Editing Ratio</h3>
                  {text.EditingRatioPart1}
                  <div className="d-flex justify-content-center">
                    <MathJax>{'\\{editingRatio=\\frac{\\#editing}{\\#total\\_count}\\}'}</MathJax>
                  </div>
                </article>

                <article id="pipeline-snpRatio">
                  <h3 className="p-4">SNP Ratio</h3>
                  {text.SNPRatioPart1}
                  <div className="d-flex justify-content-center">
                    <MathJax>{'\\{SNPRatio=\\frac{\\#SNP}{\\#total\\_count}\\}'}</MathJax>
                  </div>
                </article>

                <article id="pipeline-motifRatio">
                  <h3 className="p-4">Motif Ratio</h3>
                  {text.MotifRatioPart1}

                  <div className="d-flex justify-content-center">
                    <MathJax>{'\\{MotifRatio = \\frac{\\#reads~with~a~specific~motif}{\\#all~reads}\\}'}</MathJax>
                  </div>
                </article>

                <article id="pipeline-noRatio">
                  <h3 className="p-4">No Ratio / Nucleosome-occupancy Ratio</h3>
                  {text.NoRatioPart1}
                  <div className="d-flex justify-content-center">
                    <MathJax>{'\\{NucleosomeOccupancy~ratio = min \\left[\\frac{region}{\\frac{1}{2}(ct_1+ct_2)+0.01},2 \\right]\\}'}</MathJax>
                  </div>
                  {text.NoRatioPart2}
                </article>

                <article id="pipeline-fragsizeRatio">
                  <h3 className="p-4">Fragsize Ratio</h3>
                  {text.fragsizeRatioPart1}
                  <div className="d-flex justify-content-center">
                    <MathJax>{'\\{ratio = \\frac{short\\_ratio}{long\\_ratio+0.01}\\}'}</MathJax>
                  </div>
                </article>

                <article id="pipeline-raProtein">
                  <h3 className="p-4">Relative Abundance of Protein</h3>
                  {text.RAProteinPart1}
                  <div className="row justify-content-center">
                    <div className="center-block w-75">
                      <img src={massSpectroData} alt="" className="img-fluid" />
                    </div>
                  </div>
                  {text.RAProteinPart2}
                </article>

                <article id="pipeline-raMetabolite">
                  <h3 className="p-4">Relative Abundance of Metabolite</h3>
                  {text.RAMetabolitePart1}
                </article>
              </MathJaxContext>
            </AccordionItem>
          </div>
          {/* </ScrollSpyDiv> */}

        </div>
      </MathJaxContext>
    </div>
  );
}
