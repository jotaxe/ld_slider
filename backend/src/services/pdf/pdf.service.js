// Initializes the `pdf` service on path `/pdf`
const createService = require('feathers-mongoose');
const createModel = require('../../models/pdf.model');
const hooks = require('./pdf.hooks');

// feathers-blob service
const blobService = require('feathers-blob');
// Here we initialize a FileSystem storage,
// but you can use feathers-blob with any other
// storage service like AWS or Google Drive.
const fs = require('fs-blob-store');

// File storage location. Folder must be created before upload.
// Example: './uploads' will be located under feathers app top level.
const blobStorage = fs('./pdf');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/pdf', blobService({ Model: blobStorage}));

  // Get our initialized service so that we can register hooks
  const service = app.service('pdf');

  service.hooks(hooks);
};
