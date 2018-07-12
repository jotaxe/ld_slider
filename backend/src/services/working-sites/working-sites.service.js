// Initializes the `working_sites` service on path `/working-sites`
const createService = require('feathers-mongoose');
const createModel = require('../../models/working-sites.model');
const hooks = require('./working-sites.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'working-sites',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/working-sites', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('working-sites');

  service.hooks(hooks);
};
