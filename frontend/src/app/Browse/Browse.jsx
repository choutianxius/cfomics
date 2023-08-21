import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './Browse.css';
import NavTabs from '../../components/NavTabs';

export default function Browse () {
  const pathname = useLocation().pathname.split('/');

  const tabs = [
    { name: 'DNA', to: './dna' },
    { name: 'RNA', to: './rna' },
    { name: 'Protein', to: './protein' },
    { name: 'Metabolite', to: './metabolite' },
  ];
  const activeTab = `./${pathname[pathname.length - 1]}`;

  return (
    <>
      <NavTabs
        tabs={tabs}
        activeTab={activeTab}
      />

      <Outlet />
    </>
  );
}
