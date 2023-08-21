/* eslint-disable no-unused-vars */

import { default as React, useCallback, useEffect, useState } from 'react';
import igv from 'igvjs';
import Submenu from './Submenu';
import menuItems from './dirFiles.json';
import './GenomeBrowser.css';
import {
  beautifyOmics,
  beautifyFeature,
  beautifyDataset,
  beautifyDiseaseCondition,
} from '../../../../utils/beautify';
import { igvFileUrl, serverListeningUrl } from '../../../../config';
import CartItem from '../../../../components/CartItem';

function beautifySample (s) {
  const basename = s.split('.')[0];
  const l = basename.split('-');
  return (l[l.length - 1]).toUpperCase();
}

function itemToConfig (item) {
  const { title, url } = item;
  const basename = (title.split('.'))[0];
  const feature = (basename.split('-'))[1];

  const config = { name: basename, url: igvFileUrl + url };

  if (['apa', 'altp', 'expr', 'bsseq', 'dipseq'].includes(feature)) {
    config.type = 'wig';
    config.format = 'bigWig';
  } else if (['splc', 'fragsize', 'no'].includes(feature)) {
    config.type = 'wig';
    config.format = 'bedGraph';
  } else if (['edit', 'snp'].includes(feature)) {
    config.type = 'variant';
    config.format = 'vcf';
    config.indexURL = igvFileUrl + url + '.tbi';
  } else if (['chim'].includes(feature)) {
    config.type = 'interact';
    config.format = 'bedpe';
  } else {
    throw new Error(`Invalid feature: ${feature}`);
  }

  return config;
}

export default function GenomeBrowser ({ gene }) {
  const beautify = useCallback((title, level) => {
    try {
      if (level === 0) {
        const [omics, feature] = title.split('_');
        let feature1 = '';
        try {
          feature1 = beautifyFeature(feature);
        } catch (e) {
          feature1 = feature[0].toUpperCase() + feature.slice(1).toLowerCase();
        }
        return `${beautifyOmics(omics)} ${feature1}`;
      }
      if (level === 1) {
        return beautifyDataset(title);
      }
      if (level === 2) {
        return beautifyDiseaseCondition(title);
      }
      if (level === 3) {
        return beautifySample(title);
      }
    } catch (e) {
      return title[0].toUpperCase() + title.slice(1).toLowerCase();
    }
    throw new Error(`Invalid level: ${level}`);
  }, []);

  const id = 'igv-container';
  const [browser, setBrowser] = useState();
  const [pageReady, setPageReady] = useState(false);

  const [trackList, setTrackList] = useState([]);

  useEffect(() => {
    setPageReady(true);
    try {
      igv.removeAllBrowsers();
    } catch (e) {}
  }, [gene]);

  useEffect(() => {
    if (!pageReady) {
      return;
    }
    const igvDiv = document.getElementById(id);
    const options = {
      genome: 'hg38',
      locus: gene,
    };
    igv.createBrowser(igvDiv, options)
      .then((browser) => { setBrowser(browser); });
  }, [pageReady, gene]);

  // fetch total items
  const cachedAllMenuItems = JSON.parse(sessionStorage.getItem('cfomics-igv-options'));
  const [allMenuItems, setAllMenuItems] = useState(cachedAllMenuItems || menuItems);
  useEffect(() => {
    if (cachedAllMenuItems) { return; }
    fetch(serverListeningUrl + '/misc/getIgvOptions')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch igv options. Using a partial list');
        return res.json();
      })
      .then((data) => {
        setAllMenuItems(data);
        sessionStorage.setItem('cfomics-igv-options', JSON.stringify(data));
      })
      .catch((e) => {});
  }, []);

  function onClickItem (item) {
    if (!browser) { return; }
    if (trackList.includes(item.title)) { return; }
    setTrackList((prevList) => {
      const updatedList = Array.from(prevList);
      updatedList.push(item.title);
      return updatedList;
    });
    const config = itemToConfig(item);
    browser.loadTrack(config);
  }

  function onRemoveTrack (trackName) {
    const basename = (trackName.split('.'))[0];
    browser.removeTrackByName(basename);
    setTrackList((prevList) => {
      const updatedList = prevList.filter((x) => x !== trackName);
      return updatedList;
    });
  }

  return (
    <>
      <div className="exomics-callout">
        <div>
          <p>
            Notes:
            <br />
            You can select tracks to display by clicking options in the &apos;Sample&apos; menu
            or remove them by clicking in the &apos;Tracks&apos; menu.
          </p>
        </div>
      </div>
      <div className="d-flex">
        <div id="menu-container">
          <Submenu
            items={allMenuItems}
            level={0}
            onClickItem={onClickItem}
            beautify={beautify}
          />
          <div className="d-flex flex-column tracklist border">
            <div
              className="fw-bold text-center border-bottom track-title"
            >
              Tracks
            </div>
            <div className="tracks">
              {
                trackList.length === 0
                  ? <i>Please select</i>
                  : trackList.map((track) => (
                    <CartItem
                      key={track}
                      name={track}
                      onRemove={() => onRemoveTrack(track)}
                    />
                  ))
              }
            </div>
          </div>
        </div>
        <div className="browser-container border border-2 border-top-0" id={id} />
      </div>
    </>
  );
}
