/* eslint-disable */
import { React, Component } from 'react';
import './Help.css';

class CollapsibleNav extends Component {
  constructor (props) {
    super(props);
    this.collapseElement = null;
  }

  componentDidMount () {
    // When the component is mounted, add your DOM listener to the "nv" elem.
    // (The "nv" elem is assigned in the render function.)
    // this.nv.addEventListener('collapsible.nav.collapse', this.handleNvEnter);
    // this.nv.addEventListener('collapsible.nav.show', this.handleNvEnter);
    // this.nv.addEventListener('collapsible.nav.toggle', () => { this.togglethis(this); });
    // this.nv.addEventListener('accordion.item.toggle', console.log);
  }

  componentWillUnmount () {
    // Make sure to remove the DOM listener when the component is unmounted.
    // this.nv.removeEventListener('collapsible.nav.collapse', this.handleNvEnter);
    // this.nv.removeEventListener('collapsible.nav.show', this.handleNvEnter);
    // this.nv.removeEventListener('collapsible.nav.toggle', () => { this.togglethis(this); });
  }

  /*
  handlerone () {
    this.togglethis(this);
  }

  togglethis (par) {
    console.log(par);
    par.toggle();
  } */

  setOpenState (open) {
    // if (this.collapseElement){
    //   if (this.collapseElement.classList.contains('show') && !open) {
    //     this.collapseElement.classList.remove('show');
    //   } else if (!this.collapseElement.classList.contains('show') && open) {
    //     this.collapseElement.classList.add('show');
    //   }
    // }
    try {
      this.collapseElement.classList.add('show');
      setOpen(true);
    } catch (e) {}
  }

  toggle (setOpen) {
    // if (this.collapseElement){
    //   if (this.collapseElement.classList.contains('show')) {
    //     this.collapseElement.classList.remove('show');
    //     // console.log('false');
    //     // setOpen(false);
    //     setOpen(true);
    //   } else {
    //     this.collapseElement.classList.add('show');
    //     // console.log('true');
    //     setOpen(true);
    //   }
    // }
    try {
      this.collapseElement.classList.add('show');
      setOpen(true);
    } catch (e) {}
  }

  render () {
    const { id, onClick, href, accordionButton, open, setOpen, children } = this.props;
    //this.setOpenState(open);
    // data-bs-root-margin="0px 0px -60%"
    // console.log(open);
    // ref={(elem) => { this.nv = elem; }}
    return (
      <>
        <a className="nav-link w-100 collapsible-nav" onClick={(p) => { onClick(p); this.toggle(setOpen); }} href={href} data-bs-target={accordionButton}>{children[0]}</a>
        <nav id={id} ref={(r) => { this.collapseElement = r; this.setOpenState(open)}} className="nav nav-pills flex-columns navbar-collapse collapse">
          {children[1]}
        </nav>
      </>
    );
  }
}
export default CollapsibleNav;
