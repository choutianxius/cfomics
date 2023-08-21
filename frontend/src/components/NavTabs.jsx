import React from 'react';
import { Link } from 'react-router-dom';
import { nanoid } from 'nanoid';

/**
 *
 * @param {object} props
 * @param {Array<string>} props.tabs
 * @param {string} props.activeTab
 */
function NavTabs ({ tabs, activeTab }) {
  const tabs1 = tabs.map((tab) => (
    <li
      key={nanoid()}
      className="nav-item"
      title={tab.disabled && 'Currently underworking.'}
    >
      <Link className={`nav-link${tab.to === activeTab ? ' active' : ''}${tab.disabled ? ' disabled' : ''}`} to={tab.to}>{tab.name}</Link>
    </li>
  ));

  return (
    <ul className="nav nav-tabs mb-3 border-bottom">
      {tabs1}
    </ul>
  );
}

export default NavTabs;
