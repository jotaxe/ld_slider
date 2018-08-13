// Initializes the `pdf-data` service on path `/pdf-data`
const createService = require('feathers-mongoose');
const createModel = require('../../models/pdf-data.model');
const hooks = require('./pdf-data.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/pdf-data', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('pdf-data');

  service.hooks(hooks);
};
