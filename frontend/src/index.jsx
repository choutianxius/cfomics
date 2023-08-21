import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

import App from './app/App';
import LoadingSpinner from './components/LoadingSpinner';

const Home = React.lazy(() => import('./app/Home/HomeNew'));

const Browse = React.lazy(() => import('./app/Browse/Browse'));
const BrowseDna2 = React.lazy(() => import('./app/Browse/Dna'));
const BrowseRna = React.lazy(() => import('./app/Browse/Rna'));
const BrowseProtein = React.lazy(() => import('./app/Browse/Protein'));
const BrowseMetabolite = React.lazy(() => import('./app/Browse/Metabolite'));

const Search = React.lazy(() => import('./app/Search/Search'));
const SearchTips = React.lazy(() => import('./app/Search/Search')
  .then((module) => ({ default: module.SearchTips })));
const Gene = React.lazy(() => import('./app/Search/Gene/Gene'));
const Endmotif = React.lazy(() => import('./app/Search/Endmotif/Endmotif'));
const Microbe = React.lazy(() => import('./app/Search/Microbe/Microbe'));

const Download = React.lazy(() => import('./app/Download/Download'));
const Questionnaire = React.lazy(() => import('./app/Download/Questionnaire'));

const Help = React.lazy(() => import('./app/Help/Help'));
const Contact = React.lazy(() => import('./app/Contact/Contact'));
const ErrorPage = React.lazy(() => import('./app/ErrorPage/ErrorPage'));
const Page404 = React.lazy(() => import('./app/Page404/Page404'));
const Statistics = React.lazy(() => import('./app/Statistics/Statistics'));

const Admin = React.lazy(() => import('./app/admin/Admin'));

let Test;
if (process.env.NODE_ENV === 'development') {
  Test = React.lazy(() => import('./app/test/Test'));
} else {
  Test = React.lazy(() => import('./app/Page404/Page404'));
}

function MySuspense ({ children }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
}

const { PUBLIC_URL } = process.env;

const router = createBrowserRouter([
  {
    path: '/',
    element: (<App />),
    children: [
      {
        errorElement: (<MySuspense><ErrorPage /></MySuspense>),
        children: [
          {
            path: '',
            element: (<MySuspense><Home /></MySuspense>),
          },
          {
            path: 'home',
            element: (<MySuspense><Home /></MySuspense>),
          },
          {
            path: 'browse/',
            element: (<MySuspense><Browse /></MySuspense>),
            children: [
              {
                path: 'dna',
                element: (<MySuspense><BrowseDna2 /></MySuspense>),
              },
              {
                path: 'rna',
                element: (<MySuspense><BrowseRna /></MySuspense>),
              },
              {
                path: 'protein',
                element: (<MySuspense><BrowseProtein /></MySuspense>),
              },
              {
                path: 'metabolite',
                element: (<MySuspense><BrowseMetabolite /></MySuspense>),
              },
            ],
          },
          {
            path: 'search/',
            element: (<MySuspense><Search /></MySuspense>),
            children: [
              {
                path: '',
                element: <SearchTips activeTab="gene" />,
              },
              {
                path: 'gene',
                element: <SearchTips activeTab="gene" />,
              },
              {
                path: 'endmotif',
                element: <SearchTips activeTab="endmotif" />,
              },
              {
                path: 'microbe',
                element: <SearchTips activeTab="microbe" />,
              },
              {
                path: 'gene/:ensemblGeneId',
                element: (<MySuspense><Gene /></MySuspense>),
              },
              {
                path: 'endmotif/:id',
                element: (<MySuspense><Endmotif /></MySuspense>),
              },
              {
                path: 'microbe/:id',
                element: (<MySuspense><Microbe /></MySuspense>),
              },
            ],
          },
          {
            path: 'source',
            element: (<MySuspense><Download /></MySuspense>),
          },
          {
            path: 'questionnaire',
            element: (<MySuspense><Questionnaire /></MySuspense>),
          },
          {
            path: 'help',
            element: (<MySuspense><Help /></MySuspense>),
          },
          {
            path: 'contact',
            element: (<MySuspense><Contact /></MySuspense>),
          },
          {
            path: 'statistics',
            element: (<MySuspense><Statistics /></MySuspense>),
          },
          {
            path: 'admin',
            element: (<MySuspense><Admin /></MySuspense>),
          },
          {
            path: 'test',
            element: (<MySuspense><Test /></MySuspense>),
          },
          {
            path: '*',
            element: (<MySuspense><Page404 /></MySuspense>),
          },
        ],
      },
    ],
  },
], { basename: PUBLIC_URL });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

reportWebVitals();
