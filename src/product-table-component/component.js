import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './component.sass';
import { ProductRow } from './product-row';
import { fetchProducts, saveProduct } from '../util/api';

export class ProductTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [{
        displayName: '',
        sku: '',
        amount: '1',
        inDevelopment: 'true',
        broadcast: 'true',
        validationErrors: {}
      }],
      error: ''
    };
  }

  componentDidMount() {
    fetchProducts(
      'api.twitch.tv',
      this.props.clientId,
      this._handleFetchProductsSuccess.bind(this),
      this._handleFetchProductsError.bind(this)
    );
  }

  handleValueChange(index, event) {
    const value = event.target.value;
    const fieldName = event.target.name;
    const partial = {
      [fieldName]: value,
      dirty: true
    };
    this._updateProduct(index, partial);
  }

  handleAddProductClick(event) {
    this.setState(prevState => {
      const products = [...prevState['products']];
      const product = {
        displayName: 'New Product',
        sku: 'newSKU',
        amount: 1,
        inDevelopment: 'true',
        broadcast: 'true',
        dirty: true
      };
      products.push(product)
      return { products: products };
    });
  }

  handleSaveProductsClick(event) {
    const dirtyProducts = this.state.products.map((p, i) => {
      if (p.dirty) {
        p.saving = true
        saveProduct(
          'api.twitch.tv',
          this.props.clientId,
          this.props.token,
          p,
          this._handleSaveProductSuccess.bind(this, i),
          this._handleSaveProductError.bind(this, i)
        );
      }
      return p;
    });
    this.setState({
      products: dirtyProducts
    });
  }

  render() {
    let disableSaveButton = false;
    const skus = this.state.products.map(p => p.sku);

    const productRows = this.state.products.map((p, i) => {
      const matchingSkus = skus.filter(sku => sku === p.sku);
      if (matchingSkus.length > 1) {
        p.validationErrors = {
          ...p.validationErrors,
          sku: 'SKU must be unique'
        }
      } else if (p.validationErrors.sku === 'SKU must be unique') {
        delete p.validationErrors.sku;
      }

      if (p.validationErrors && Object.keys(p.validationErrors).length > 0) {
        disableSaveButton = true;
      }

      return (
        <ProductRow key={i} product={p} handleValueChange={this.handleValueChange.bind(this, i)} />
      );
    });

    return (
      <div className="product-table">
        {this.state.error &&
          <div className="product-table__error">
            <h4>Error getting products.</h4>
            <p>{this.state.error}</p>
          </div>
        }
        <div className="product-table__header">
          <div className="text-col">Product Name</div>
          <div className="text-col">SKU</div>
          <div className="text-col">Amount (in Bits)</div>
          <div className="select-col">In Development</div>
          <div className="select-col">Broadcast</div>
          <div className="dirty-col"></div>
        </div>
        {productRows}
        <div className="product-table__buttons">
          <button className="product-table__add-button" onClick={this.handleAddProductClick.bind(this)}>
            Add Product
          </button>
          <button className="product-table__save-button"
              onClick={this.handleSaveProductsClick.bind(this)}
              disabled={disableSaveButton}>
            Save All
          </button>
        </div>
      </div>
    );
  }

  _updateProduct(index, partial) {
    this.setState(prevState => {
      const products = prevState.products.map((product, idx) => {
        if (idx === index) {
          let newProduct = {
            ...product,
            ...partial
          };
          newProduct.validationErrors = this._validateProduct(newProduct);
          return newProduct;
        }
        return product;
     });
     return { products: products };
    });
  }

  _validateProduct(product) {
    let validationErrors = {};

    if (!product.displayName) {
      validationErrors.displayName = 'Name must not be empty';
    } else if (product.displayName.length > 255) {
      validationErrors.displayName = 'Name must be less than 256 characters';
    }

    if (!product.sku) {
      validationErrors.sku = 'SKU must not be empty'
    } else if (product.sku.search(/^\S*$/)) {
      validationErrors.sku = 'SKU must not contain any whitespace'
    } else if (product.sku.length > 255) {
      validationErrors.sku = 'SKU must be less than 256 characters';
    }

    if (!product.amount) {
      validationErrors.amount = 'Amount must not be empty'
    } else if (product.amount < 1 || product.amount > 10000) {
      validationErrors.amount = 'Amount must be between 1 and 10,000'
    }

    return validationErrors;
  }

  _handleFetchProductsSuccess(products) {
    this.setState({ products: products });
  }

  _handleFetchProductsError(error) {
    this.setState({ error: error });
  }

  _handleSaveProductSuccess(index) {
    const partial = {
      dirty: false
    };
    this._updateProduct(index, partial);
  }

  _handleSaveProductError(index, error) {
    const partial = {
      error: error
    };
    this._updateProduct(index, partial);
  }
}

ProductTable.propTypes = {
  clientId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired
}