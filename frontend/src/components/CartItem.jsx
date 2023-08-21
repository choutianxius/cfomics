import React from 'react';
import './CartItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function CartItem ({ name, onRemove = () => {} }) {
  return (
    <div className="exomics-cart-item">
      <FontAwesomeIcon
        icon={faXmark}
        onClick={onRemove}
      />
      <span title={name}>{name}</span>
    </div>
  );
}
