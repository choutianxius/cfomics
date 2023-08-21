import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

function AnalysisListGroup ({
  title,
  options,
  activeIdx = 0,
  onChangeOption = () => {},
  beautify = (x) => x,
}) {
  return (
    <>
      <h6 className="fst-italic fw-bold p-0">
        {title}
      </h6>
      <SimpleBar
        style={{ maxHeight: '18rem' }}
        scrollbarMaxSize={100}
        scrollbarMinSize={100}
      >
        <div className="list-group list-group-flush">
          {
          options.map((x, idx) => (
            <button
              type="button"
              key={uuidv4()}
              className={
                'list-group-item list-group-item-action'
                  + (idx === activeIdx ? ' active' : '')
              }
              aria-current={idx === activeIdx}
              onClick={
                () => { onChangeOption(x); }
              }
            >
              {beautify(x)}
            </button>
          ))
        }
        </div>
      </SimpleBar>
    </>
  );
}

export default AnalysisListGroup;
