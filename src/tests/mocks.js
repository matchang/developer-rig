
export function mockFetchForManifest() {
  var p = new Promise((resolve, reject) => {
    resolve({
      ok: true,
      json: function () {
        return {
          data: [
            {
              id: '0',
            }
          ]
        }
      }
    });
  });
  return p;
}

export function mockFetchErrorForManifest() {
  var p = new Promise((resolve, reject) => {
    resolve({
      ok: false
    });
  });
  return p;
}

export function mockFetchForExtensionManifest() {
  var p = new Promise((resolve, reject) => {
    resolve({
      ok: true,
      json: function () {
        return {
          extensions: [
            {
              version: 1,
              id: 'clientid',
              views: {}
            }
          ]
        }
      }
    });
  });
  return p;
}

export function mockFetchError() {
  var p = new Promise((resolve, reject) => {
    resolve({
      ok: false,
    });
  });
  return p;
}

export function mockFetchProducts() {
  const p = new Promise((resolve, reject) => {
    resolve({
      json: function () {
        return {
          products: [
            {
              domain: 'twitch.ext.mock',
              sku: 'test1',
              displayName: 'Test 1',
              cost: {amount: 1, type: 'bits'},
              inDevelopment: true,
              broadcast: false
            },
            {
              domain: 'twitch.ext.mock',
              sku: 'test2',
              displayName: 'Test 2',
              cost: {amount: 100, type: 'bits'},
              inDevelopment: false,
              broadcast: false
            }
          ]
        };
      }
    });
  });
  return p;
}