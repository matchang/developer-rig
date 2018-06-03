import { setupShallowTest } from '../tests/enzyme-util/shallow';
import { RigNav } from './component';
import { EXTENSION_VIEWS, BROADCASTER_CONFIG, LIVE_CONFIG, CONFIGURATIONS, PRODUCT_MANAGEMENT } from '../constants/nav-items';

describe('<RigNav />', () => {
  const setupShallow = setupShallowTest(RigNav, () => ({
    login: {},
    loginHandler: jest.fn(),
    bitsEnabled: true,
    openConfigurationsHandler: jest.fn(),
    openProductManagementHandler: jest.fn(),
    viewerHandler: jest.fn(),
    configHandler: jest.fn(),
    liveConfigHandler: jest.fn(),
    selectedView: EXTENSION_VIEWS,
    error: '',
  }));

  it('renders correctly', () => {
    const { wrapper } = setupShallow();
    expect(wrapper).toMatchSnapshot();
  });

  it('renders an error', () => {
    const { wrapper } = setupShallow({
      error: 'test error',
    });
    expect(wrapper.find('.top-nav-error').text().trim()).toBe('test error');
  });

  it('correctly handles clicks on each tab', () => {
    const { wrapper } = setupShallow();
    wrapper.find('a.top-nav-item').forEach(tab => {
      tab.simulate('click');
    });
    expect(wrapper.instance().props.viewerHandler).toHaveBeenCalled();
    expect(wrapper.instance().props.configHandler).toHaveBeenCalled();
    expect(wrapper.instance().props.liveConfigHandler).toHaveBeenCalled();
    expect(wrapper.instance().props.openConfigurationsHandler).toHaveBeenCalled();
    expect(wrapper.instance().props.openProductManagementHandler).toHaveBeenCalled();
  });

  it('correct css classes are set when things are selected', () => {
    const { wrapper } = setupShallow({
      selectedView: EXTENSION_VIEWS,
    });
    expect(wrapper.find('.top-nav-item__selected')).toHaveLength(1);

    wrapper.setProps({
      selectedView: BROADCASTER_CONFIG,
    });
    wrapper.update();
    expect(wrapper.find('.top-nav-item__selected')).toHaveLength(1);

    wrapper.setProps({
      selectedView: LIVE_CONFIG,
    });
    wrapper.update();
    expect(wrapper.find('.top-nav-item__selected')).toHaveLength(1);

    wrapper.setProps({
      selectedView: CONFIGURATIONS,
    });
    wrapper.update();
    expect(wrapper.find('.top-nav-item__selected')).toHaveLength(1);

    wrapper.setProps({
      selectedView: PRODUCT_MANAGEMENT,
    });
    wrapper.update();
    expect(wrapper.find('.top-nav-item__selected')).toHaveLength(1);
  });

  it('correctly hides the Product Management tab when extension is bits enabled', () => {
    const { wrapper } = setupShallow({
      bitsEnabled: false
    });
    expect(wrapper.findWhere(el => el.text() === 'Manage Products').exists()).toBe(false);
  })
});
