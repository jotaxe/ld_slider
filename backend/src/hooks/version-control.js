// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const presService = context.app.service("presentations");
    const presName = context.data.name;
    const belongsTo = context.data.belongs_to;
    const presData = await presService.find({
      query: {
        $limit: 15,
        name: presName,
        belongs_to: belongsTo,
        $sort: {
          version: -1
        }
      }
    });
    if(presData.data.length > 0){
      const lastVersion = presData.data[0].version;
      context.data.version = lastVersion + 1;
    }
    return context;
  };
};
