import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import './Submenu.css';

function SubmenuTitle (level) {
  if (level === 0) {
    return 'Feature';
  }
  if (level === 1) {
    return 'Collection';
  }
  if (level === 2) {
    return 'Disease Group';
  }
  if (level === 3) {
    return 'Sample';
  }
  return 'Title';
}

export default function Submenu ({
  items,
  level = 0,
  onClickItem = () => {},
  beautify = (x) => x,
}) {
  const nextLevel = level + 1;
  return (
    <ul
      className={
      `list-group list-group-flush border ${level === 0 ? 'igv-menu' : 'igv-submenu'}${level === 3 ? ' terminal' : ''}`
      }
    >
      <li className="list-group-item fw-bold">
        {SubmenuTitle(level)}
      </li>
      {
        items.map((item) => {
          if (!item.items) {
            return (
              <button
                key={uuidv4()}
                type="button"
                className="list-group-item list-group-item-action"
                onClick={() => onClickItem(item)}
              >
                {beautify(item.title, level)}
              </button>
            );
          }
          if (item.items.length === 0) return null;
          return (
            <li key={uuidv4()} className="list-group-item has-submenu">
              <div className="list-group-item-action">
                {beautify(item.title, level)}
              </div>
              <Submenu
                items={item.items}
                level={nextLevel}
                onClickItem={onClickItem}
                beautify={beautify}
              />
            </li>
          );
        })
      }
    </ul>
  );
}
