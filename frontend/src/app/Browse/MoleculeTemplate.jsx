import { default as React, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HashLink } from 'react-router-hash-link';
import { defaultHashLinkScroll } from '../../utils/hashLinkScroll';
import SSRTable from '../../components/SSRTableNew';
import { TableDownloadSearchHeader } from '../../components/TableDownloadHeader';
import { serverListeningUrl } from '../../config';
import {
  default as beautify,
  beautifyFeature,
  beautifyValue,
  beautifyEntity,
  beautifySpecimen,
  beautifyDataset,
  beautifyDiseaseCondition,
  beautifyGeneLocus,
  beautifyStrand,
} from '../../utils/beautify';
import encodeQueryParams from '../../utils/encodeQueryParams';
import MicrobeStackBar from './MicrobeStackBar';
import EndmotifStackBar from './EndmotifStackBar';
import browseOptions from './browseOptions.json';
import LoadingGlower from '../../components/LoadingGlower';
import ErrorAlert from '../../components/ErrorAlert';

/**
 *
 * @param {object} props
 * @param {string} props.className
 * @param {function} props.onClick
 * @param {boolean} props.active
 * @param {string} props.name
 * @param {Array<string>} props.cancers
 * @param {number} props.randomColorOffset
 */
function DatasetBar ({ className, onClick, active, name, cancers, randomColorOffset }) {
  function idx2Color (idx) {
    const colors = ['primary', 'danger', 'indigo', 'success'];
    const len = colors.length;
    return colors[idx % len];
  }
  return (
    <button
      type="button"
      className={
        'px-2 py-1 col-auto d-flex align-items-center exomics-browse-dataset-bar '
        + className
        + (active ? ' active' : '')
      }
      onClick={onClick}
    >
      <span className="me-2 fw-bold">{beautifyDataset(name)}</span>
      <div className="d-flex flex-wrap">
        {cancers.map((cancer, idx) => (
          <span
            className="exomics-browse-dataset-cancer my-1"
            key={cancer}
            color={idx2Color(idx + randomColorOffset)}
          >
            {beautifyDiseaseCondition(cancer)}
          </span>
        ))}
      </div>
    </button>
  );
}

function sortFeatures (prev, next) {
  const all = [
    'bsseq', 'dipseq', 'fragsize', 'no',
    'expr', 'altp', 'apa', 'chim', 'snp', 'edit', 'splc', 'te',
    'itst',
    'microbe', 'endmotif',
  ];
  const prevIdx = all.findIndex((x) => x === prev);
  const nextIdx = all.findIndex((x) => x === next);
  return (prevIdx - nextIdx);
}

function globalRowMapper (prevRow, linkState) {
  try {
    const feature = linkState.dFeature;
    const row = { ...prevRow };
    if (Object.keys(row)[0] === 'Result') return ({ Result: 'No data found.' });

    let hs = null;
    let egi = null;

    if (Object.keys(row).includes('hgnc_symbol')) { hs = row.hgnc_symbol; }
    if (Object.keys(row).includes('ensembl_gene_id')) { egi = row.ensembl_gene_id; }

    if (Object.keys(row).includes('hgnc_symbol')) {
      if (egi) {
        if (Number(egi) !== 0) {
          row.hgnc_symbol = (
            <Link to={`/search/gene/${egi}`} state={{ linkState }}>
              {hs}
            </Link>
          );
        } else {
          row.hgnc_symbol = 'Intergenic Region';
        }
      }
    }

    // if (row.ensembl_gene_id) {
    //   if (Number(egi) !== 0) {
    //     row.ensembl_gene_id = (
    //       <Link to={`/search/gene/${egi}`} state={{ linkState }}>
    //         {egi}
    //       </Link>
    //     );
    //   } else {
    //     row.ensembl_gene_id = 'Intergenic Region';
    //   }
    // }

    if (Object.keys(row).includes('strand')) {
      row.strand = beautifyStrand(row.strand);

      // if strand is present
      // then chromosome_name, start_position, end_position
      // are present
      row.gene_locus = beautifyGeneLocus(
        row.chromosome_name,
        row.start_position,
        row.end_position,
      );
      delete row.chromosome_name;
      delete row.start_position;
      delete row.end_position;

      // row.gene_biotype is also present
      row.gene_biotype = beautify(row.gene_biotype);
    }

    if (feature === 'endmotif') {
      const f = row.feature;
      row.feature = (
        <Link to={`/search/endmotif/${f}`} state={{ linkState }}>
          {f}
        </Link>
      );
    }

    if (feature === 'microbe') {
      const f = row.feature;
      row.feature = (
        <Link to={`/search/microbe/${f}`} state={{ linkState }}>
          {f}
        </Link>
      );
    }

    if (['altp', 'apa'].includes(feature)) {
      // ENSG00000000003.14|TSPAN6|protein_coding|2206|100636689.-
      // ENST00000387347.2|ENSG00000210082.2|chrM|+
      const f = row.feature;
      const egi = (f.split('.'))[0];
      row.feature = (
        <Link to={`/search/gene/${egi}`} state={{ linkState }}>
          {f}
        </Link>
      );
    }

    if (feature === 'splc') {
      // A3SS|ENSG00000130734.9|ATG4D|chr19|+|10546838|10547253|10547188|10547253|10544956|10545130
      const f = row.feature;
      const egiv = (f.split('|'))[1];
      const egi = (egiv.split('.'))[0];
      row.feature = (
        <Link to={`/search/gene/${egi}`} state={{ linkState }}>
          {f}
        </Link>
      );
    }

    if (feature === 'itst') {
      const egi = (row.gene_id.split('.'))[0];
      row.gene_id = (
        <Link to={`/search/gene/${egi}`} state={{ linkState }}>
          {egi}
        </Link>
      );
    }

    delete row.ensembl_gene_id;
    delete row.Cgi_ID;
    delete row.Promoter_Gene_ID;
    delete row.Promoter_ID;
    delete row.ensembl_gene_id_version;
    delete row.Gene_ID;

    // sort columns
    const indexCols = [
      'hgnc_symbol', 'gene_locus', 'strand', 'gene_biotype', // gene
      'gene_id', 'protein_id', // protein
      'feature', // microbe, endmotif and metabolite
    ];

    // if only feature is in indexCols, do not delete it
    // else delete
    const indexCount = Object.keys(row).reduce(
      (accumulator, currentValue) => {
        if (indexCols.includes(currentValue)) {
          return accumulator + 1;
        }
        return accumulator;
      },
      0,
    );

    if (indexCount !== 1) {
      delete row.feature;
    }

    const sortedRow = {};
    indexCols.forEach((k) => {
      if (Object.keys(row).includes(k)) {
        sortedRow[k] = row[k];
      }
    });
    Object.keys(row).forEach((k) => {
      if (!indexCols.includes(k)) {
        sortedRow[k] = row[k];
      }
    });

    return sortedRow;
  } catch (e) { return prevRow; }
}

/**
 *
 * @param {object} props
 * @param {string} props.omics
 */
export default function BaseBrowse ({ omics }) {
  const options = browseOptions[omics];

  function getSubomicsList () {
    const list = Object.keys(options);
    list.sort(sortFeatures);
    return Array.from(list);
  }

  function getValueList (subomics) {
    const o = options[subomics];
    return Object.keys(o);
  }

  function getElementList (subomics, value) {
    const o = options[subomics][value];
    return Object.keys(o);
  }

  function getSpecimenList (subomics, value, element) {
    const o = options[subomics][value][element];
    return Object.keys(o);
  }

  const dOptions = {};
  if (omics === 'cfdna') {
    dOptions.subomics = 'bsseq';
    dOptions.value = 'beta';
    dOptions.element = 'gene';
    dOptions.specimen = 'plasma';

    dOptions.dataset = 'gse124600';
  } else if (omics === 'cfrna') {
    dOptions.subomics = 'expr';
    dOptions.value = 'tpm';
    dOptions.element = 'gene';
    dOptions.specimen = 'plasma';

    dOptions.dataset = 'gse106804';
  } else if (omics === 'pro') {
    dOptions.subomics = 'itst';
    dOptions.value = 'itst';
    dOptions.element = 'gene';
    dOptions.specimen = 'serum';

    dOptions.dataset = 'pxd007217';
  } else if (omics === 'met') {
    dOptions.subomics = 'area';
    dOptions.value = 'area';
    dOptions.element = 'met';
    dOptions.specimen = 'plasma';

    dOptions.dataset = 'msv000080950';
  } else {
    throw new Error(`Unsupported omics: ${omics}`);
  }

  // values of <select>...</select>
  const [subomics, setSubomics] = useState(dOptions.subomics);
  const [value, setValue] = useState(dOptions.value);
  const [element, setElement] = useState(dOptions.element);
  const [specimen, setSpecimen] = useState(dOptions.specimen);

  const subomicsList = getSubomicsList();
  const elementList = getElementList(subomics, value);
  const specimenList = getSpecimenList(subomics, value, element);

  // When changing low level values
  // higher level values should be set
  // to their defaults
  function onChangeSpecimen (nextSpecimen) {
    setSpecimen(nextSpecimen);
  }

  function onChangeElement (nextElement) {
    setElement(nextElement);
    const nextSpecimenList = getSpecimenList(subomics, value, nextElement);
    const nextSpecimen = nextSpecimenList[0];
    setSpecimen(nextSpecimen);
  }

  function onChangeSubomicsValue (nextSubomics, nextValue) {
    // Change the pair at the same time
    setSubomics(nextSubomics);
    setValue(nextValue);
    const nextElementList = getElementList(nextSubomics, nextValue);
    let nextElement = nextElementList[0];
    // special behavior
    if (nextElementList.includes('gene')) {
      nextElement = 'gene';
    }
    setElement(nextElement);
    const nextSpecimenList = getSpecimenList(nextSubomics, nextValue, nextElement);
    const nextSpecimen = nextSpecimenList[0];
    setSpecimen(nextSpecimen);
  }

  const [datasetList, setDatasetList] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [searchContent, setSearchContent] = useState('');

  // used for fetching tables
  // should only change with the 'Confirm' button
  // or a dataset bar is clicked
  const [confirmedChoices, setConfirmedChoices] = useState({
    subomics,
    value,
    dataset: dOptions.dataset,
    element,
    specimen,
    searchBy: 'hgnc_symbol',
    // value of the <input /> above the table
    searchContent,
  });

  useEffect(() => {
    // First load page
    // Fetch the corresponding dataset list

    // copy dOptions inside useEffect
    // to prevent unnessary re-render
    const dOptions = {};
    if (omics === 'cfdna') {
      dOptions.subomics = 'bsseq';
      dOptions.value = 'beta';
      dOptions.element = 'gene';
      dOptions.specimen = 'plasma';

      dOptions.dataset = 'gse124600';
    } else if (omics === 'cfrna') {
      dOptions.subomics = 'expr';
      dOptions.value = 'tpm';
      dOptions.element = 'gene';
      dOptions.specimen = 'plasma';

      dOptions.dataset = 'gse106804';
    } else if (omics === 'pro') {
      dOptions.subomics = 'itst';
      dOptions.value = 'itst';
      dOptions.element = 'gene';
      dOptions.specimen = 'serum';

      dOptions.dataset = 'pxd007217';
    } else if (omics === 'met') {
      dOptions.subomics = 'area';
      dOptions.value = 'area';
      dOptions.element = 'met';
      dOptions.specimen = 'plasma';

      dOptions.dataset = 'msv000080950';
    } else {
      throw new Error(`Unsupported omics: ${omics}`);
    }

    setLoading(true);
    let datasetWithColsUrl = serverListeningUrl;
    datasetWithColsUrl += '/misc/getDatasetCols';
    const payload = {
      omics,
      subomics: dOptions.subomics,
      element: dOptions.element,
      specimen: dOptions.specimen,
      value: dOptions.value,
    };
    fetch(datasetWithColsUrl, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (res.ok) { return res.json(); }
        throw new Error((await res.json()).detail);
      })
      .then((data) => {
        // Update datasetList
        // and set dataset to its first element
        setDatasetList(data);
        setErrorMessage(null);
      })
      .catch((e) => {
        setErrorMessage(e.message);
      })
      .finally(() => { setLoading(false); });
  }, [omics]);

  function scrollAfterConfirm () {
    const element = document.getElementById('table-breadcrumb');
    defaultHashLinkScroll(element);
  }

  function onConfirmSelections () {
    // Click "Confirm" button under the selections

    // scrolling
    scrollAfterConfirm();

    // Fetch the corresponding dataset list
    setLoading(true);
    let datasetWithColsUrl = serverListeningUrl;
    datasetWithColsUrl += '/misc/getDatasetCols';
    const payload = { omics, subomics, element, specimen, value };
    fetch(datasetWithColsUrl, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (res.ok) { return res.json(); }
        throw new Error((await res.json()).detail);
      })
      .then((data) => {
        // Update datasetList
        // and set dataset to its first element
        setDatasetList(data);
        const nextDataset = (data[0]).dataset;
        setConfirmedChoices((prev) => ({
          ...prev,
          subomics,
          value,
          element,
          specimen,
          dataset: nextDataset,
          searchContent: '',
        }));
        setSearchContent('');
        setErrorMessage(null);
      })
      .catch((e) => {
        setErrorMessage(e.message);
      })
      .finally(() => { setLoading(false); });
  }

  function onChangeDataset (nextDataset) {
    // Click a new dataset bar
    setConfirmedChoices((prev) => ({
      ...prev,
      dataset: nextDataset,
      searchContent: '',
    }));
    setSearchContent('');
  }

  // props that are passed to Server Side Rendering table
  const getRows = useCallback(async (sortBy, sortDirection, rowsPerPage, currPage) => {
    const firstRow = (currPage - 1) * rowsPerPage;
    const res = await fetch(
      serverListeningUrl + '/browse/getBrowseTable',
      {
        method: 'POST',
        body: JSON.stringify({
          omics,
          subomics: confirmedChoices.subomics,
          dataset: confirmedChoices.dataset,
          element: confirmedChoices.element,
          specimen: confirmedChoices.specimen,
          value: confirmedChoices.value,
          by: confirmedChoices.searchContent.length === 0
            ? null
            : confirmedChoices.searchBy,
          list: confirmedChoices.searchContent.length === 0
            ? null
            : confirmedChoices.searchContent.trim().split(',').map((s) => s.trim().toUpperCase()),
          sortBy,
          sortDirection,
          firstRow,
          rowsPerPage,
        }),
        headers: { 'Content-type': 'application/json' },
      },
    );
    let rows = [{ Result: 'No data found' }];
    if (res.ok) {
      const data = await res.json();
      if (data.rows.length > 0) {
        rows = data.rows;
      }
    }
    return rows;
  }, [confirmedChoices, omics]);

  const getTotalRowNumber = useCallback(async () => {
    const res = await fetch(
      serverListeningUrl + '/browse/getBrowseTableTotalRowNumber',
      {
        method: 'POST',
        body: JSON.stringify({
          omics,
          subomics: confirmedChoices.subomics,
          dataset: confirmedChoices.dataset,
          element: confirmedChoices.element,
          specimen: confirmedChoices.specimen,
          value: confirmedChoices.value,
          by: confirmedChoices.searchContent.length === 0
            ? null
            : confirmedChoices.searchBy,
          list: confirmedChoices.searchContent.length === 0
            ? null
            : confirmedChoices.searchContent.trim().split(',').map((s) => s.trim().toUpperCase()),
        }),
        headers: { 'Content-Type': 'application/json' },
      },
    );
    if (res.ok) {
      const data = await res.json();
      return data.totalRows > 0 ? data.totalRows : 1;
    }
    return 1;
  }, [confirmedChoices, omics]);

  const rowMapper = useCallback((row) => {
    const linkState = {
      dOmics: omics,
      dFeature: confirmedChoices.subomics,
      dDataset: confirmedChoices.dataset,
      dSpecimen: confirmedChoices.specimen,
      dElement: confirmedChoices.element,
    };
    return globalRowMapper(row, linkState);
  }, [omics, confirmedChoices]);

  const [downloadFormat, setDownloadFormat] = useState('csv');
  const handleChangeDownloadFormat = useCallback((format) => { setDownloadFormat(format); }, []);

  const downloadLink = serverListeningUrl + '/download/mean' + encodeQueryParams({
    format: downloadFormat,
    omics,
    subomics: confirmedChoices.subomics,
    dataset: confirmedChoices.dataset,
    element: confirmedChoices.element,
    specimen: confirmedChoices.specimen,
    value: confirmedChoices.value,
    by: (typeof confirmedChoices.searchContent !== 'string' || confirmedChoices.searchContent.length === 0)
      ? '' : confirmedChoices.searchBy,
    list: (typeof confirmedChoices.searchContent !== 'string' || confirmedChoices.searchContent.length === 0)
      ? '' : confirmedChoices.searchContent,
  });

  return (
    <>
      <div className="container-fluid px-4" style={{ marginTop: '1rem', marginBottom: '1rem' }}>

        <label className="row my-1 gx-5 align-items-center" htmlFor="select-subomics">
          <span className="col-6 col-lg-4 text-end">
            Feature Type:
          </span>
          <div className="col-6">
            <select
              className="form-select"
              id="select-subomics"
              value={`${subomics}-${value}`}
              onChange={(e) => {
                const [nextFeature, nextValue] = e.target.value.split('-');
                onChangeSubomicsValue(nextFeature, nextValue);
              }}
            >
              {
                subomicsList.map((feature) => {
                  const valueList = getValueList(feature);
                  return valueList.map((value) => (
                    <option
                      key={`${feature}-${value}`}
                      value={`${feature}-${value}`}
                    >
                      {`${beautifyFeature(feature)} -- ${beautifyValue(value)}`}
                    </option>
                  ));
                })
              }
            </select>
          </div>
        </label>

        <label
          className="row my-1 gx-5 align-items-center"
          htmlFor="select-element"
          hidden={(elementList.length === 1 && element === 'entity')}
        >
          <span className="col-6 col-lg-4 text-end">
            {
              (
                subomics === 'microbe'
                  ? 'Taxonomy Level'
                  : 'Genetic Element'
              ) + ':'
            }
          </span>
          <div className="col-6">
            <select
              className="form-select"
              id="select-element"
              value={element}
              onChange={(e) => {
                onChangeElement(e.target.value);
              }}
            >
              {
                elementList.map((s) => (
                  <option key={s} value={s}>
                    {beautifyEntity(s)}
                  </option>
                ))
              }
            </select>
          </div>
        </label>

        <label className="row my-1 gx-5 align-items-center" htmlFor="select-specimen">
          <span className="col-6 col-lg-4 text-end">Specimen:</span>
          <div className="col-6">
            <select
              className="form-select"
              id="select-specimen"
              value={specimen}
              onChange={(e) => {
                onChangeSpecimen(e.target.value);
              }}
            >
              {
                specimenList.map((s) => (
                  <option value={s} key={s}>
                    {beautifySpecimen(s)}
                  </option>
                ))
              }
            </select>
          </div>
        </label>

        <div className="row mt-2 gx-5 align-items-center">
          <div className="col-6 col-lg-4">&nbsp;</div>
          <div className="col-6 d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onConfirmSelections}
            >
              Confirm
            </button>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-12">
            <div className="exomics-callout">
              <div>
                <p>
                  <strong>Tips:</strong>
                  <br />
                  <i>Feature Type:</i>
                  &nbsp;Users can select different types of data for an interesting feature.
                  <br />
                  <i>Value:</i>
                  &nbsp;Each feature type corresponds to a specific type of value.
                  <br />
                  <i>Genetic Element / Taxonomy Level:</i>
                  &nbsp;Users can select entities of data table.
                  <br />
                  <i>Specimen:</i>
                  &nbsp;Users can select a specific specimen in which data generates
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="exomics-horizontal-rule" />

      <nav aria-label="breadcrumb" className="mb-5 text-success" id="table-breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            {beautifyFeature(confirmedChoices.subomics)}
          </li>
          <li className="breadcrumb-item">
            {beautifyValue(confirmedChoices.value)}
          </li>
          {
            (!(confirmedChoices.element === 'entity')) && (
              <li className="breadcrumb-item">
                {beautifyEntity(confirmedChoices.element)}
              </li>
            )
          }
          <li className="breadcrumb-item">
            {beautifySpecimen(confirmedChoices.specimen)}
          </li>
        </ol>
      </nav>

      {
        (() => {
          if (loading) { return <LoadingGlower />; }
          if (errorMessage) { return <ErrorAlert message={errorMessage} />; }
          if (!datasetList) { return null; }
          if (datasetList.length === 0) {
            return <ErrorAlert message="No dataset found" />;
          }
          return (
            <div className="container-fluid px-4" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <div className="row my-1 gx-5 align-items-start">
                <span className="col-6 col-lg-4 text-end my-1">
                  Found&nbsp;
                  <strong>
                    {datasetList.length}
                  </strong>
                  &nbsp;
                  {datasetList.length === 1 ? 'dataset' : 'datasets'}
                  :
                </span>

                <div className="col-6 d-flex flex-column">
                  {
                    datasetList.map((x, idx) => (
                      <DatasetBar
                        randomColorOffset={idx * 3}
                        key={x.dataset}
                        name={x.dataset}
                        cancers={x.cancers}
                        className="my-1"
                        onClick={() => {
                          onChangeDataset(x.dataset);
                        }}
                        active={confirmedChoices.dataset === x.dataset}
                      />
                    ))
                  }
                </div>
              </div>

              <div className="row d-flex justify-content-center my-3">
                <div className="col-2">
                  <HashLink
                    type="button"
                    className="btn btn-primary"
                    to="/source#literature"
                    style={{ fontSize: '.75rem' }}
                    scroll={defaultHashLinkScroll}
                  >
                    <FontAwesomeIcon icon={faUpRightFromSquare} />
                    &nbsp;Dataset Details
                  </HashLink>
                </div>

                <div className="col-1" />

                <div className="col-2">
                  <HashLink
                    type="button"
                    className="btn btn-primary"
                    to="/help#nomenclature-collapseButton"
                    scroll={defaultHashLinkScroll}
                    style={{ fontSize: '.75rem' }}
                  >
                    <FontAwesomeIcon icon={faUpRightFromSquare} />
                    &nbsp;Disease Details
                  </HashLink>
                </div>
              </div>
            </div>
          );
        })()
      }

      <div className="exomics-horizontal-rule" />
      <TableDownloadSearchHeader
        inputPlaceholder={
              confirmedChoices.element === 'gene'
                ? 'HGNC Symbol, e.g. BRCA2, SOX9'
                : 'Can\'t search when element is not gene'
            }
        inputValue={searchContent}
        onInput={(e) => { setSearchContent(e.target.value); }}
        onSearch={() => {
          setConfirmedChoices((prev) => ({
            ...prev,
            searchContent,
          }));
        }}
        searchDisabled={confirmedChoices.element !== 'gene'}
        downloadFormat={downloadFormat}
        onChangeDownloadFormat={handleChangeDownloadFormat}
        downloadLink={downloadLink}
      />
      <SSRTable
        getTotalRowNumber={getTotalRowNumber}
        getRows={getRows}
        rowMapper={rowMapper}
        valueColTitle={
          beautifyValue(confirmedChoices.value)
            + ' (value) of current entity'
            + ' in '
            + beautifySpecimen(confirmedChoices.specimen)
            + ' (specimen)'
        }
      />
      {
        confirmedChoices.subomics === 'microbe' && (
          <MicrobeStackBar
            dataset={confirmedChoices.dataset}
            specimen={confirmedChoices.specimen}
            element={confirmedChoices.element}
          />
        )
      }
      {
        confirmedChoices.subomics === 'endmotif' && (
          <EndmotifStackBar
            dataset={confirmedChoices.dataset}
            specimen={confirmedChoices.specimen}
          />
        )
      }
    </>
  );
}
