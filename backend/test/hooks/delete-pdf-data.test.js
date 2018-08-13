const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const deletePdfData = require('../../src/hooks/delete-pdf-data');

describe('\'delete-pdf-data\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      after: deletePdfData()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
