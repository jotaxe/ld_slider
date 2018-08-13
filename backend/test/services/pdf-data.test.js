const assert = require('assert');
const app = require('../../src/app');

describe('\'pdf-data\' service', () => {
  it('registered the service', () => {
    const service = app.service('pdf-data');

    assert.ok(service, 'Registered the service');
  });
});
