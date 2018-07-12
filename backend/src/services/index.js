const workingSites = require('./working-sites/working-sites.service.js');
const presentations = require('./presentations/presentations.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(workingSites);
  app.configure(presentations);
};
