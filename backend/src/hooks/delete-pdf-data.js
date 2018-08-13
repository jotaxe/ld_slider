// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const dFileName = context.result.id;
    const pdfDataService = context.app.service('pdf-data');
    pdfDataService.remove(null, {query: {fileName: dFileName}});
    return context;
  };
};
