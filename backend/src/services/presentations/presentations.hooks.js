const addToWorkingSite = require('../../hooks/add-to-working-site');

const versionControl = require('../../hooks/version-control');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [versionControl()],
    update: [versionControl()],
    patch: [versionControl()],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [addToWorkingSite()],
    update: [],
    patch: [],
    remove: []
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
