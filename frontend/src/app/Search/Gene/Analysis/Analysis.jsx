/* eslint-disable react/jsx-one-expression-per-line */

import { default as React, useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';

import Selection from './Selection';
import Details from './Details';
import StackedBoxPlot from './StackedBoxPlot';
import HeatMap from './HeatMap';
import NonStackedBoxPlot from './NonStackedBoxPlot';
// import Comparison1 from './Comparison1';
import ComparisonCls1New from './ComparisonCls1New';
// import Comparison2 from './Comparison2';
import ComparisonCls2New from './ComparisonCls2New';
import { beautifyDataset, beautifyEntity, beautifyFeature, beautifyOmics, beautifySpecimen } from '../../../../utils/beautify';
import Breadcrumb from '../../../../components/Breadcrumb';
import { defaultHashLinkScroll } from '../../../../utils/hashLinkScroll';

// const FIRST_CLASS = ['apa', 'bsseq', 'dipseq', 'fragsize', 'no', 'expr'];
const SECOND_CLASS = ['altp', 'apa', 'chim', 'edit', 'snp', 'splc', 'itst'];
// const THIRD_CLASS = ['endmotif', 'microbe'];

/**
 *
 * @param {object} props
 * @param {string} props.gene ensembl_gene_id
 */
export default function Analysis ({
  gene,
  dOmics,
  dFeature,
  dDataset,
  dSpecimen,
  dElement,
}) {
  // {
  //   omics: 'cfdna',
  //   feature: 'dipseq',
  //   dataset: 'gse112679',
  //   specimen: 'plasma',
  //   element: 'gene',
  // }
  const [confirmedOptions, setConfirmedOptions] = useState({
    omics: dOmics,
    feature: dFeature,
    dataset: dDataset,
    specimen: dSpecimen,
    element: dElement,
  });

  const confirmSelection = useCallback((
    omics,
    feature,
    dataset,
    specimen,
    element,
  ) => {
    setConfirmedOptions({
      omics,
      feature,
      dataset,
      specimen,
      element,
    });
    const el = document.getElementById('analysis-start');
    defaultHashLinkScroll(el);
  }, []);

  const breadcrumbItems = [
    beautifyOmics(confirmedOptions.omics),
    beautifyFeature(confirmedOptions.feature),
    beautifyDataset(confirmedOptions.dataset),
    beautifySpecimen(confirmedOptions.specimen),
  ];

  if (confirmedOptions.element !== 'entity') {
    breadcrumbItems.push(beautifyEntity(confirmedOptions.element));
  }

  return (
    <div className="card rounded-0 h-100">
      <div className="card-header rounded-0 d-flex align-items-center">
        <FontAwesomeIcon icon={faChartColumn} className="me-2" />
        Analysis
      </div>
      <div className="card-body rounded-0 overflow-auto">
        <div className="exomics-callout">
          <div>
            <p>
              Notes:
              <br />
              Explore gene data statistics across different molecular types,
              feature types, datasets, and specimens. Just select them by clicking
              and view corresponding data statistics easily. Start uncovering insights today!
            </p>
          </div>
        </div>

        <Selection
          onConfirm={confirmSelection}
          dOmics={dOmics}
          dFeature={dFeature}
          dDataset={dDataset}
          dSpecimen={dSpecimen}
          dElement={dElement}
        />

        <div className="exomics-horizontal-rule" />

        <div id="analysis-start" />

        {
          SECOND_CLASS.includes(confirmedOptions.feature) && (
            <>
              <h5 className="mt-3 mb-2">
                <strong>{beautifyFeature(confirmedOptions.feature)}</strong>
                &nbsp;Details
              </h5>

              <div className="exomics-callout">
                <div>
                  <p>
                    Notes:
                    <br />
                    Check details of data by clicking buttons of different disease conditions
                  </p>
                </div>
              </div>

              <Breadcrumb items={breadcrumbItems} />

              <Details
                gene={gene}
                omics={confirmedOptions.omics}
                feature={confirmedOptions.feature}
                dataset={confirmedOptions.dataset}
                specimen={confirmedOptions.specimen}
                element={confirmedOptions.element}
              />
              <div className="exomics-horizontal-rule" />
            </>
          )
        }

        <h5 className="mt-3 mb-2">
          <strong>{beautifyFeature(confirmedOptions.feature)}</strong>
          &nbsp;Profile
        </h5>
        <div className="exomics-callout">
          <div>
            <p>
              Notes:
              <br />
              Shown here are profile how a feature of
              gene performs in different disease conditions.
            </p>
          </div>
        </div>
        <Breadcrumb items={breadcrumbItems} />
        {
          SECOND_CLASS.includes(confirmedOptions.feature)
            ? (
              <>
                <div className="d-flex justify-content-center">
                  <StackedBoxPlot
                    gene={gene}
                    omics={confirmedOptions.omics}
                    feature={confirmedOptions.feature}
                    dataset={confirmedOptions.dataset}
                    specimen={confirmedOptions.specimen}
                    element={confirmedOptions.element}
                  />
                </div>
                <div className="exomics-horizontal-rule" />
                <div className="d-flex justify-content-center mt-3">
                  <HeatMap
                    gene={gene}
                    omics={confirmedOptions.omics}
                    feature={confirmedOptions.feature}
                    dataset={confirmedOptions.dataset}
                    specimen={confirmedOptions.specimen}
                    element={confirmedOptions.element}
                  />
                </div>
              </>
            )
            : (
              <div className="d-flex justify-content-center">
                <NonStackedBoxPlot
                  gene={gene}
                  omics={confirmedOptions.omics}
                  feature={confirmedOptions.feature}
                  dataset={confirmedOptions.dataset}
                  specimen={confirmedOptions.specimen}
                  element={confirmedOptions.element}
                />
              </div>
            )
        }

        <div className="exomics-horizontal-rule" />

        <h5 className="mt-3 mb-2">
          <strong>{beautifyFeature(confirmedOptions.feature)}</strong>
          &nbsp;Comparison
        </h5>
        <div className="exomics-callout">
          <div>
            <p>
              Notes:
              <br />
              Using&nbsp;
              <a href="https://en.wikipedia.org/wiki/Mann%E2%80%93Whitney_U_test">
                Mann-Whitney U Test
              </a>, this module does comparison across different disease conditions
              (ns: Not significant, *:p≤0.05, **:p≤0.01, ***:p≤0.001, ****:p≤0.0001) .
            </p>
          </div>
        </div>
        <Breadcrumb items={breadcrumbItems} />
        {
          SECOND_CLASS.includes(confirmedOptions.feature)
            ? (
              <ComparisonCls2New
                gene={gene}
                omics={confirmedOptions.omics}
                feature={confirmedOptions.feature}
                dataset={confirmedOptions.dataset}
                specimen={confirmedOptions.specimen}
                element={confirmedOptions.element}
              />
            )
            : (
              <ComparisonCls1New
                gene={gene}
                feature={confirmedOptions.feature}
                dataset={confirmedOptions.dataset}
                specimen={confirmedOptions.specimen}
                element={confirmedOptions.element}
              />
            )
        }
      </div>
    </div>
  );
}
