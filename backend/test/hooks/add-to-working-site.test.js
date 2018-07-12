const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const addToWorkingSite = require('../../src/hooks/add-to-working-site');

describe('\'addToWorkingSite\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      after: addToWorkingSite()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
