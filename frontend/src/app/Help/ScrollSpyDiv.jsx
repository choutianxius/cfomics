import { React, Component } from 'react';
import './Help.css';
import { ScrollSpy } from 'bs';

function eventHandler (param) {
  // console.log(param.relatedTarget);
  // /if (param.relatedTarget.className.includes('collapsible-nav')){
  //  param.relatedTarget.
  // }
  param.relatedTarget.dispatchEvent(new Event('collapsible.nav.toggle'));
}

export function refresh () {
  const dataSpyList = document.querySelectorAll('[data-bs-spy="scroll"]');
  dataSpyList.forEach((dataSpyEl) => {
    const a = ScrollSpy.getOrCreateInstance(dataSpyEl);
    a.refresh();
    dataSpyEl.addEventListener('activate.bs.scrollspy', eventHandler);
  });
}

export class ScrollSpyDiv extends Component {
  componentDidMount () {
    refresh();
  }

  render () {
    const { target, children } = this.props;
    // data-bs-root-margin="0px 0px -60%"
    return (
      <div data-bs-spy="scroll" data-bs-target={target} data-bs-smooth-scroll="false">
        {children}
      </div>
    );
  }
}
