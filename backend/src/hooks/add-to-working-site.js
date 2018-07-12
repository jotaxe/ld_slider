// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
  	const presId = context.result._id
  	const belongsTo = context.result.belongs_to;
  	workingSiteService = context.app.service("working-sites");
  	workingSiteService.patch(belongsTo, {
  		$push: {
  			presentations: presId
  		}
  	});
    return context;
  };
};
