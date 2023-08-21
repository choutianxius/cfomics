import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFile,
  faUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import beautify from '../../../utils/beautify';

function beautifyStrand (strand) {
  try {
    const strandIdx = parseFloat(strand);
    if (strandIdx === 1) {
      return '+';
    }
    if (strandIdx === -1) {
      return '-';
    }
    return '';
  } catch (e) {
    return '';
  }
}

function beautifyGeneLocus (
  chromosomeName,
  startPosition,
  endPosition,
  strand,
) {
  try {
    if (!(chromosomeName && startPosition && endPosition)) {
      return 'N/A';
    }
    let locus = 'chr'
      + String(chromosomeName).toUpperCase()
      + ', '
      + parseInt(startPosition)
      + '-'
      + parseInt(endPosition);
    const strand1 = beautifyStrand(strand);
    if (strand1) {
      locus += ', ';
      locus += strand1;
    }
    return locus;
  } catch (e) {
    return 'N/A';
  }
}

export default function BasicInfo ({ basicInfo }) {
  if (!basicInfo) return null;

  return (
    <div className="card rounded-0 h-100">
      <div className="card-header rounded-0 d-flex align-items-center">
        <FontAwesomeIcon icon={faFile} className="me-2" />
        <span className="me-auto">
          Basic Information
        </span>
      </div>
      <div className="card-body rounded-0 overflow-auto">
        <table className="table">
          <tbody>
            <tr>
              <td className="fw-semibold">HGNC Symbol</td>
              <td className="text-gray-600">
                <span className="me-3">
                  {basicInfo.hgnc_symbol.toUpperCase()}
                </span>
                <a
                  className="link-primary fst-italic"
                  href={`https://www.ncbi.nlm.nih.gov/gene/?term=${basicInfo.hgnc_symbol}`}
                  target="_blank"
                  rel="noreferrer"
                  title="View in NCBI Gene"
                >
                  <FontAwesomeIcon icon={faUpRightFromSquare} className="me-2" />
                  NCBI
                </a>
              </td>
              <td className="fw-semibold">Ensembl Id</td>
              <td className="text-gray-600">
                <span className="me-3">
                  {basicInfo.ensembl_gene_id.toUpperCase()}
                </span>
                <a
                  className="link-primary fst-italic"
                  target="_blank"
                  href={
                    'https://useast.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g='
                      + basicInfo.ensembl_gene_id
                  }
                  rel="noreferrer"
                  title="View in Ensembl Genome Browser"
                >
                  <FontAwesomeIcon icon={faUpRightFromSquare} className="me-2" />
                  Ensembl
                </a>
              </td>
            </tr>
            <tr>
              <td className="fw-semibold">Genome Location (hg38)</td>
              <td className="text-gray-600">
                {
                  beautifyGeneLocus(
                    basicInfo.chromosome_name,
                    basicInfo.start_position,
                    basicInfo.end_position,
                    basicInfo.strand,
                  )
                }
              </td>
              <td className="fw-semibold">Gene Biotype</td>
              <td className="text-gray-600">
                {beautify(basicInfo.gene_biotype)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
