import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './component.sass';
import { EXTENSION_VIEWS, BROADCASTER_CONFIG, LIVE_CONFIG, CONFIGURATIONS, PRODUCT_MANAGEMENT } from '../constants/nav-items'
import { UserDropdown } from '../user-dropdown';
import { LoginButton } from '../login-button';

export class RigNav extends Component {
  openConfigurationsHandler = () => {
    this.props.openConfigurationsHandler();
  }

  render() {
    if (this.props.error !== '') {
      return (
        <div className="top-nav-error">
          <a> {this.props.error} </a>
        </div>
      );
    } else {
      return (
        <div className="top-nav">
          <a
            className={this.props.selectedView === EXTENSION_VIEWS ? "top-nav-item top-nav-item__selected" : "top-nav-item"}
            onClick={this.props.viewerHandler}>Extension Views</a>
          <a
            className={this.props.selectedView === BROADCASTER_CONFIG ? "top-nav-item top-nav-item__selected" : "top-nav-item"}
            onClick={this.props.configHandler}>Broadcaster Config</a>
          <a
            className={this.props.selectedView === LIVE_CONFIG ? "top-nav-item top-nav-item__selected" : "top-nav-item"}
            onClick={this.props.liveConfigHandler}>Live Config</a>
          <a
            className={this.props.selectedView === CONFIGURATIONS ? "top-nav-item top-nav-item__selected" : "top-nav-item"}
            onClick={this.openConfigurationsHandler}>Configurations</a>
          {this.props.bitsEnabled && 
            <a
              className={this.props.selectedView === PRODUCT_MANAGEMENT ? "top-nav-item top-nav-item__selected" : "top-nav-item"}
              onClick={this.props.openProductManagementHandler}>Manage Products</a>
          }
          {this.props.login.login ? <UserDropdown login={this.props.login} /> : <LoginButton loginHandler={this.props.loginHandler}/>}
        </div>
      );
    }
  }
}

RigNav.propTypes = {
  openProductManagementHandler: PropTypes.func,
  openConfigurationsHandler: PropTypes.func,
  viewerHandler: PropTypes.func,
  configHandler: PropTypes.func,
  liveConfigHandler: PropTypes.func,
  selectedView: PropTypes.string,
  error: PropTypes.string,
  login: PropTypes.object,
  bitsEnabled: PropTypes.bool
};
