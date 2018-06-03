import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './component.sass';

export class LoginButton extends Component {
  render() {
    const rigAuthUrl = 'https://id.twitch.tv/oauth2/authorize?client_id=2dhk7ewe0el4fyu2y8af42v3i0znx5&redirect_uri=https://localhost.rig.twitch.tv:3000&response_type=token&scope=user:edit+extensions:edit:catalog';
    return (
      <div className="login-button">
        <a href={rigAuthUrl}>
          <button
          // onClick={this.props.loginHandler}>
          >Log In</button>
        </a>
      </div>
    );
  }
}

LoginButton.propTypes = {
  loginHandler: PropTypes.func.isRequired
};
