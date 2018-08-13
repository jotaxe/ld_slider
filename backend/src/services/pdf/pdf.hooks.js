

const fileToUri = require('../../hooks/file-to-uri');

const addPdfData = require('../../hooks/add-pdf-data');

const deletePdfData = require('../../hooks/delete-pdf-data');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [fileToUri()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [addPdfData()],
    update: [],
    patch: [],
    remove: [deletePdfData()]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
