const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const addPdfData = require('../../src/hooks/add-pdf-data');

describe('\'add-pdf-data\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      after: addPdfData()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
