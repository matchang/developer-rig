import { setupShallowTest } from '../tests/enzyme-util/shallow';
import { ProductTable } from './component';
import { ProductRow } from './product-row';

function mockApiFunctions() {
  const original = require.requireActual('../util/api');
  return {
    ...original,
    fetchProducts: jest.fn(() => { return PRODUCTS; })
  }
}
jest.mock('../util/api', () => mockApiFunctions());
const api = require.requireMock('../util/api');

const CLIENT_ID = 'client-id';
const TOKEN = 'token';
const PRODUCTS = [
  {
    sku: 'test1',
    displayName: 'Test 1',
    amount: '1',
    inDevelopment: 'true',
    broadcast: 'false',
    validationErrors: {}
  },
  {
    sku: 'test2',
    displayName: 'Test 2',
    amount: '100',
    inDevelopment: 'false',
    broadcast: 'false',
    validationErrors: {}
  }
];

describe('<ProductTable />', () => {
  const setupShallow = setupShallowTest(ProductTable, () => ({
    clientId: CLIENT_ID,
    token: TOKEN
  }));

  it('renders correctly', () => {
    const { wrapper } = setupShallow();
    expect(wrapper).toMatchSnapshot();
  });

  it('should fetch products', () => {
    expect(api.fetchProducts).toHaveBeenCalledTimes(1);
  });
});

describe('<ProductRow />', () => {
  const setupShallow = setupShallowTest(ProductRow, () => ({
    product: PRODUCTS[0]
  }));

  it('renders correctly', () => {
    const { wrapper } = setupShallow();
    expect(wrapper).toMatchSnapshot();
  });

  it('shows validation errors', () => {
    const { wrapper } = setupShallow({
      product: {
        ...PRODUCTS[0],
        validationErrors: {
          sku: 'SKU is invalid'
        }
      }
    });
    expect(wrapper.find('input.invalid[name="sku"]')).toHaveLength(1);
    expect(wrapper.find('p.invalid-hint').filterWhere(n => n.text() === 'SKU is invalid')).toHaveLength(1);
  });

  it('shows row as dirty', () => {
    const { wrapper } = setupShallow({
      product: {
        ...PRODUCTS[0],
        dirty: true
      }
    });
    expect(wrapper.find('.dirty-indicator')).toHaveLength(1);
  });
});