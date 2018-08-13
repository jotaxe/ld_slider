const assert = require('assert');
const app = require('../../src/app');

describe('\'pdf\' service', () => {
  it('registered the service', () => {
    const service = app.service('pdf');

    assert.ok(service, 'Registered the service');
  });
});
