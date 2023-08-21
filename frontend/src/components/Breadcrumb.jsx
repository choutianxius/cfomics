import React from 'react';
import { nanoid } from 'nanoid';
import './Breadcrumb.css';

/**
 *
 * @param {object} props
 * @param {Array<string>} props.items
 * @returns {JSX.Element}
 */
export default function Breadcrumb ({ items }) {
  return (
    <ul className="my-breadcrumb text-success">
      {
        items.map((item) => (
          <li key={nanoid()}>
            {item}
          </li>
        ))
      }
    </ul>
  );
}
