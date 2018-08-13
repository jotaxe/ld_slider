// Initializes the `uploads` service on path `/uploads`
const createService = require('feathers-memory');
const hooks = require('./uploads.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/uploads', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('uploads');

  service.hooks(hooks);
};
