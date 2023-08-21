import React, { useCallback, useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { nanoid } from 'nanoid';
import GeneTypeahead from '../../components/GeneTypeahead';
import EndmotifTypeahead from '../../components/EndmotifTypeahead';
import MicrobeTypeahead from '../../components/MicrobeTypeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import './Search.css';

function NavTabs ({ tabs, activeTab, onSwitchTab = () => {} }) {
  const tabs1 = tabs.map((tab) => (
    <li
      key={nanoid()}
      className="nav-item"
      title={tab.disabled && 'Currently underworking.'}
    >
      <Link
        className={
          `d-flex align-items-center nav-link${tab.to === activeTab ? ' active' : ''}${tab.disabled ? ' disabled' : ''}`
        }
        to={tab.to}
        onClick={onSwitchTab}
      >
        {tab.name}
        {tab.badges && tab.badges.map((badge) => (
          <span
            className={`badge rounded-pill text-${badge.color}-emphasis bg-${badge.color}-subtle fw-normal ms-1`}
            style={{ fontSize: '.6rem' }}
            key={nanoid()}
          >
            {badge.name}
          </span>
        ))}
      </Link>
    </li>
  ));

  return (
    <ul className="nav nav-tabs mb-3 border-bottom">
      {tabs1}
    </ul>
  );
}

export function SearchTips ({ activeTab, onClickTipsLink }) {
  let tipsContent;
  if (activeTab === 'gene') {
    tipsContent = (
      <>
        Search a gene by entering a Ensembl ID [e.g.&nbsp;
        <Link
          to="/search/gene/ENSG00000141510"
          onClick={() => { onClickTipsLink('ENSG00000141510'); }}
        >
          ENSG00000141510
        </Link>
        ] or HGNC symbol [e.g.&nbsp;
        <Link
          to="/search/gene/ENSG00000141510"
          onClick={() => { onClickTipsLink('TP53'); }}
        >
          TP53
        </Link>
        ]
      </>
    );
  } else if (activeTab === 'endmotif') {
    tipsContent = (
      <>
        Search an end motif by entering a 4-mer-sequence [e.g.&nbsp;
        <Link
          to="/search/endmotif/TCGA"
          onClick={() => { onClickTipsLink('TCGA'); }}
        >
          TCGA
        </Link>
        ]
      </>
    );
  } else if (activeTab === 'microbe') {
    tipsContent = (
      <>
        Search a microbe by entering a taxonomy name [e.g.&nbsp;
        <Link
          to="/search/microbe/106591|Ensifer"
          onClick={() => { onClickTipsLink('Ensifer'); }}
        >
          Ensifer
        </Link>
        ] or a taxonomy ID of NCBI Taxonomy Browser database [e.g.&nbsp;
        <Link
          to="/search/microbe/106591|Ensifer"
          onClick={() => { onClickTipsLink('106591'); }}
        >
          106591
        </Link>
        ]
      </>
    );
  } else {
    throw new Error(`Unknown type, reading: ${activeTab}`);
  }

  return (

    <div className="row justify-content-center g-0">
      <div className="col-9">
        <div className="exomics-callout">
          <div>
            <p>
              Tips:
              <br />
              {tipsContent}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Search () {
  // pathname: /search/gene/TP53
  const pathname = useLocation().pathname.split('/');
  const tabs = [
    {
      name: 'Gene',
      to: './gene',
      badges: [
        { color: 'success', name: 'cfDNA' },
        { color: 'warning', name: 'cfRNA' },
        { color: 'danger', name: 'Protein' },
      ],
    },
    {
      name: 'End Motifs',
      to: './endmotif',
      badges: [
        { color: 'success', name: 'cfDNA' },
      ],
    },
    {
      name: 'Microbe',
      to: './microbe',
      badges: [
        { color: 'success', name: 'cfDNA' },
        { color: 'warning', name: 'cfRNA' },
      ],
    },
  ];
  const activeTab = `./${pathname[2]}`;

  const [input, setInput] = useState(decodeURI(pathname[3] || ''));
  const onClickTipsLink = useCallback((q) => { setInput(q); }, []);

  let typeahead = null;
  if (activeTab === './gene') {
    typeahead = <GeneTypeahead dInput={input} />;
  } else if (activeTab === './endmotif') {
    typeahead = <EndmotifTypeahead dInput={input} />;
  } else if (activeTab === './microbe') {
    typeahead = <MicrobeTypeahead dInput={input} />;
  } else {
    throw new Error(`Unknown type, reading: ${activeTab}`);
  }

  return (
    <>
      <div className="exomics-search-banner container-fluid mb-5">

        <h1 className="text-center">Search cfOmics</h1>

        <div className="row justify-content-center g-0">
          <div className="col-9">
            <NavTabs
              tabs={tabs}
              activeTab={activeTab}
              onSwitchTab={() => { setInput(''); }}
            />
            {typeahead}
          </div>
        </div>

      </div>

      <Outlet onClickTipsLink={onClickTipsLink} />
    </>
  );
}
