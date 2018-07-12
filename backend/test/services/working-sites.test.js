const assert = require('assert');
const app = require('../../src/app');

describe('\'working_sites\' service', () => {
  it('registered the service', () => {
    const service = app.service('working-sites');

    assert.ok(service, 'Registered the service');
  });
});
