// working_sites-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const workingSites = new Schema({
    name: { type: String, required: true },
    presentations: [{type: Schema.ObjectId, ref: 'presentation'}]
  }, {
    timestamps: true
  });

  return mongooseClient.model('workingSites', workingSites);
};
