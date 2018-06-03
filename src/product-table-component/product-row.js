import React from 'react';
import PropTypes from 'prop-types';

export const ProductRow = (props) => {
  return (
    <div className="product-table__row">
      <div className="text-col">
        <input type="text" 
          className="form__input"
          name="displayName"
          value={props.product.displayName}
          onChange={props.handleValueChange}
        />
      </div>
      <div className="text-col">
        <input type="text"
          className="form__input"
          name="sku"
          value={props.product.sku}
          onChange={props.handleValueChange}
        />
      </div>
      <div className="text-col">
        <input type="number"
          className="form__input"
          name="amount"
          value={props.product.amount}
          onChange={props.handleValueChange}
        />
      </div>
      <div className="select-col">
        <select name="inDevelopment"
            className="form__input"
            value={props.product.inDevelopment}
            onChange={props.handleValueChange}>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      <div className="select-col">
        <select name="broadcast"
            className="form__input"
            value={props.product.broadcast}
            onChange={props.handleValueChange}>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      <div className="dirty-col">
        {props.product.dirty &&
          <div className="dirty-indicator">
            <svg xmlns='http://www.w3.org/2000/svg' width='30' height='30'>
              <circle cx='5' cy='5' r='3' />
            </svg>
          </div>
        }
      </div>
    </div>
  );
}

ProductRow.propTypes = {
  product: PropTypes.object.isRequired
}