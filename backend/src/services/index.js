const workingSites = require('./working-sites/working-sites.service.js');
const presentations = require('./presentations/presentations.service.js');
const uploads = require('./uploads/uploads.service.js');
const pdf = require('./pdf/pdf.service.js');
const pdfData = require('./pdf-data/pdf-data.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(workingSites);
  app.configure(presentations);
  app.configure(uploads);
  app.configure(pdf);
  app.configure(pdfData);
};
