import React, { Component } from 'react';
import { RigNav } from '../rig-nav';
import { ExtensionViewContainer } from '../extension-view-container';
import { ExtensionRigConsole } from '../console';
import { ExtensionViewDialog } from '../extension-view-dialog';
import { RigConfigurationsDialog } from '../rig-configurations-dialog';
import { EditViewDialog } from '../edit-view-dialog';
import { createExtensionObject } from '../util/extension';
import { createSignedToken } from '../util/token';
import { fetchManifest, fetchExtensionManifest, fetchUserInfo } from '../util/api';
import { EXTENSION_VIEWS, BROADCASTER_CONFIG, LIVE_CONFIG, CONFIGURATIONS, PRODUCT_MANAGEMENT } from '../constants/nav-items'
import { ViewerTypes } from '../constants/viewer-types';
import { OverlaySizes } from '../constants/overlay-sizes';
import { IdentityOptions } from '../constants/identity-options';
import { MobileSizes } from '../constants/mobile';
import { RIG_ROLE } from '../constants/rig';
import { ProductManagementViewContainer } from '../product-management-container/component';
const { ExtensionMode, ExtensionViewType } = window['extension-coordinator'];

export class Rig extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clientId: process.env.EXT_CLIENT_ID,
      secret: process.env.EXT_SECRET,
      version: process.env.EXT_VERSION,
      channelId: process.env.EXT_CHANNEL_ID,
      userName: process.env.EXT_USER_NAME,
      mode: ExtensionMode.Viewer,
      extensionViews: [],
      manifest: {},
      showExtensionsView: false,
      showConfigurations: false,
      showEditView: false,
      showLoginView: false,
      showProductManagementView: false,
      idToEdit: 0,
      selectedView: EXTENSION_VIEWS,
      extension: {},
      userId: '',
      error: '',
      login: {},
    };
  }

  componentDidMount() {
    this._fetchInitialConfiguration();
  }

  componentWillMount() {
    this._initLocalStorage();
    this._setLogin();
  }

  openConfigurationsHandler = () => {
    this.setState({
      showConfigurations: true,
      selectedView: CONFIGURATIONS
    });
  }
  closeConfigurationsHandler = () => {
    this.setState({
      showConfigurations: false,
    });
  }

  openEditViewHandler = (id) => {
    this.setState({
      showEditView: true,
      idToEdit: id,
    });
  }

  closeEditViewHandler = () => {
    this.setState({
      showEditView: false,
      idToEdit: '0',
    });
  }

  viewerHandler = () => {
    this.setState({
      mode: ExtensionMode.Viewer,
      selectedView: EXTENSION_VIEWS,
      extension: {},
    });
  }

  configHandler = () => {
    this.setState({
      mode: ExtensionMode.Config,
      selectedView: BROADCASTER_CONFIG,
      extension: createExtensionObject(
        this.state.manifest,
        0,
        ViewerTypes.Broadcaster,
        '',
        this.state.userName,
        this.state.channelId,
        this.state.secret),
    });
  }

  liveConfigHandler = () => {
    this.setState({
      mode: ExtensionMode.Dashboard,
      selectedView: LIVE_CONFIG,
      extension: createExtensionObject(
        this.state.manifest,
        0,
        ViewerTypes.Broadcaster,
        '',
        this.state.userName,
        this.state.channelId,
        this.state.secret),
    });
  }

  openProductManagementHandler = () => {
    this.setState({
      selectedView: PRODUCT_MANAGEMENT,
    });
  }

  openExtensionViewHandler = () => {
    if (this.state.error === '') {
      this.setState({
        showExtensionsView: true,
      });
    }
  }

  closeExtensionViewDialog = () => {
    this.setState({
      showExtensionsView: false
    });
  }

  refreshConfigurationsHandler = () => {
    const token = createSignedToken(RIG_ROLE, '', this.state.userId, this.state.channelId, this.state.secret);
    fetchExtensionManifest('api.twitch.tv', this.state.clientId, this.state.version, token, this._onConfigurationSuccess, this._onConfigurationError);
  }

  loginHandler = () => {
    this.setState({
      showLoginView: true
    });
  }

  _onConfigurationSuccess = (data) => {
    this.setState(data);
  }

  _onConfigurationError = (errMsg) => {
    this.setState({
      error: errMsg,
    });
  }

  _getFrameSizeFromDialog(dialogRef) {
    if (dialogRef.state.frameSize === 'Custom') {
      return {
        width: dialogRef.state.width,
        height: dialogRef.state.height
      };
    }
    if (dialogRef.state.extensionViewType === ExtensionViewType.Mobile) {
      return MobileSizes[dialogRef.state.frameSize];
    }

    return OverlaySizes[dialogRef.state.frameSize];
  }

  createExtensionView = () => {
    const extensionViews = this._getExtensionViews();
    const linked = this.refs.extensionViewDialog.state.identityOption === IdentityOptions.Linked;
    extensionViews.push({
      id: (extensionViews.length + 1).toString(),
      type: this.refs.extensionViewDialog.state.extensionViewType,
      extension: createExtensionObject(
        this.state.manifest,
        (extensionViews.length + 1).toString(),
        this.refs.extensionViewDialog.state.viewerType,
        linked,
        this.state.userName,
        this.state.channelId,
        this.state.secret,
        this.refs.extensionViewDialog.state.opaqueId,
      ),
      linked: linked,
      role: this.refs.extensionViewDialog.state.viewerType,
      x: this.refs.extensionViewDialog.state.x,
      y: this.refs.extensionViewDialog.state.y,
      orientation: this.refs.extensionViewDialog.state.orientation,
      frameSize: this._getFrameSizeFromDialog(this.refs.extensionViewDialog),
    });
    this._pushExtensionViews(extensionViews);
    this.closeExtensionViewDialog();
  }

  deleteExtensionView = (id) => {
    this._pushExtensionViews(this.state.extensionViews.filter(element => element.id !== id));
  }

  editViewHandler = (newViewState) => {
    const views = this._getExtensionViews();
    views.forEach(element => {
      if (element.id === this.state.idToEdit) {
        element.x = newViewState.x;
        element.y = newViewState.y;
        element.orientation = newViewState.orientation;
      }
    });
    this._pushExtensionViews(views);
    this.closeEditViewHandler();
  }

  render() {
    let view = (
      <div>
        <ExtensionViewContainer
          ref="extensionViewContainer"
          mode={this.state.mode}
          extensionViews={this.state.extensionViews}
          deleteExtensionViewHandler={this.deleteExtensionView}
          openExtensionViewHandler={this.openExtensionViewHandler}
          openEditViewHandler={this.openEditViewHandler}
          extension={this.state.extension} />
        {this.state.showExtensionsView &&
          <ExtensionViewDialog
            ref="extensionViewDialog"
            extensionViews={this.state.manifest.views}
            show={this.state.showExtensionsView}
            closeHandler={this.closeExtensionViewDialog}
            saveHandler={this.createExtensionView} />}
        {this.state.showEditView &&
          <EditViewDialog
            ref="editViewDialog"
            idToEdit={this.state.idToEdit}
            show={this.state.showEditView}
            views={this._getExtensionViews()}
            closeHandler={this.closeEditViewHandler}
            saveViewHandler={this.editViewHandler}
          />}
        <RigConfigurationsDialog
          show={this.state.showConfigurations}
          config={this.state.manifest}
          closeConfigurationsHandler={this.closeConfigurationsHandler}
          refreshConfigurationsHandler={this.refreshConfigurationsHandler} />
        <ExtensionRigConsole />
      </div>
    );

    if (this.state.selectedView === PRODUCT_MANAGEMENT) {
      view = (
        <ProductManagementViewContainer clientId={this.state.clientId} token={this.state.accessToken} />
      );
    }

    return (
      <div>
        <RigNav
          ref="rigNav"
          login={this.state.login}
          bitsEnabled={this.state.manifest.bits_enabled}
          selectedView={this.state.selectedView}
          viewerHandler={this.viewerHandler}
          configHandler={this.configHandler}
          liveConfigHandler={this.liveConfigHandler}
          openConfigurationsHandler={this.openConfigurationsHandler}
          openProductManagementHandler={this.openProductManagementHandler}
          loginHandler={this.loginHandler}
          error={this.state.error}/>
        {view}
      </div>
    );
  }

  _getExtensionViews() {
    const extensionViewsValue = localStorage.getItem("extensionViews");
    return extensionViewsValue ? JSON.parse(extensionViewsValue) : extensionViewsValue;
  }

  _pushExtensionViews(newViews) {
    localStorage.setItem("extensionViews", JSON.stringify(newViews));
    this.setState({
      extensionViews: newViews,
    });
  }

  _fetchInitialConfiguration() {
    fetchManifest("api.twitch.tv", this.state.clientId, this.state.userName, this.state.version, this.state.channelId, this.state.secret, this._onConfigurationSuccess, this._onConfigurationError);
  }

  _initLocalStorage() {
    const extensionViewsValue = localStorage.getItem("extensionViews");
    if (!extensionViewsValue) {
      localStorage.setItem("extensionViews", JSON.stringify([]));
      return;
    }
    this.setState({
      extensionViews: JSON.parse(extensionViewsValue)
    })
  }

  _setLogin() {
    const windowHash = window.location.hash;
    const rigLogin = localStorage.getItem('rigLogin');
    if (windowHash.includes('access_token')) {
      const accessTokenKey = 'access_token=';
      const accessTokenIndex = windowHash.indexOf(accessTokenKey);
      const ampersandIndex = windowHash.indexOf('&');
      const accessToken = windowHash.substring(accessTokenIndex + accessTokenKey.length, ampersandIndex);
      fetchUserInfo('api.twitch.tv', accessToken, resp => {
        this.setState({
          accessToken: accessToken,
          login: resp,
        });
        localStorage.setItem('rigLogin', JSON.stringify({
          login: resp,
          accessToken: accessToken,
        }));
      }, err => {
        this.setState({
          error: err,
        });
      })
    }
    else if (rigLogin) {
      const login = JSON.parse(rigLogin);
      this.setState({
        accessToken: login.accessToken,
        login: login.login,
      })
    }
  }
}
