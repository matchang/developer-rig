import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './component.sass';
import { ProductTable } from '../product-table-component';

export class ProductManagementViewContainer extends Component {
  render() {
    return (
      <div className='view-container-wrapper'>
        <div className='view-container'>
          <ProductTable clientId={this.props.clientId} token={this.props.token} />
        </div>
      </div>
    );
  }
}

ProductManagementViewContainer.propTypes = {
  clientId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired
}