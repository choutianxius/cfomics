/* eslint-disable max-len */
import { React, Component } from 'react';
import { refresh } from './ScrollSpyDiv';

function toggleAccordionItem (button, target, params) {
  try {
    const collapseButtonElement = button;
    const collapseElement = target;

    const collapseClassList = collapseElement.classList;
    if (collapseClassList.contains('accordion-collapse') && collapseClassList.contains('collapse')) {
      if (collapseClassList.contains('show')) {
        collapseButtonElement.classList.remove('collapsed');
        collapseElement.classList.remove('show');
        // setOpen(false);
        params?.setOpen(false);
      } else {
        collapseButtonElement.classList.add('collapsed');
        collapseElement.classList.add('show');
        params?.setOpen(true);
      }
    }
    collapseElement.dispatchEvent(new Event('accordion.item.toggle'));
  } catch (err) {}
  refresh();
}

export function openAccordionItem (setOpen, param) {
  try {
    const collapseButtonElement = document.querySelector(param.target.getAttribute('data-bs-target'));
    const collapseElement = document.querySelector(collapseButtonElement.getAttribute('data-bs-target'));

    const collapseClassList = collapseElement.classList;
    if (collapseClassList.contains('accordion-collapse') && collapseClassList.contains('collapse')) {
      if (!collapseClassList.contains('show')) {
        // collapseElement.classList += ' show ';
        // collapseButtonElement.classList += ' collapsed ';
        collapseElement.classList.add('show');
        collapseButtonElement.classList.add('collapsed');
        setOpen(true);
      }
    }
  } catch (err) {}
  refresh();
}

export class AccordionItem extends Component {
  constructor (props) {
    super(props);
    this.collapseElement = null;
    this.collapseButtonElement = null;
  }

  setOpenState (open) {
    if (this.collapseButtonElement && this.collapseElement) {
      if (this.collapseElement.classList.contains('show') !== open) {
        toggleAccordionItem(this.collapseButtonElement, this.collapseElement);
      }
    }
  }

  render () {
    const { idName, title, show, open, setOpen, children } = this.props;
    return (
      <div id={idName} className="accordion-item shadow">
        <h2 className="accordion-header">
          <button
            id={idName + '-collapseButton'}
            ref={(r) => { this.collapseButtonElement = r; }}
            className={'accordion-button' + (show === 'true' ? ' collapsed ' : '')}
            type="button"
            onClick={(curr) => { toggleAccordionItem(curr.target, this.collapseElement, { setOpen }); }}
            data-bs-target={'#' + idName + '-collapse'}
          >
            <h2 className="p-3">{title}</h2>
          </button>
        </h2>

        <div id={idName + '-collapse'} ref={(r) => { this.collapseElement = r; this.setOpenState(open); }} className={'accordion-collapse collapse' + (show === 'true' ? ' show ' : '')}>
          <div className="accordion-body">
            {children}
          </div>
        </div>
      </div>
    );
  }
}
