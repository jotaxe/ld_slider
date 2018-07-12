// presentations-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const presentations = new Schema({
    name: { type: String, required: true },
    presentation_file: { type: Schema.Types.Mixed, required: true},
    belongs_to: {type: Schema.ObjectId, ref: 'workingSites', required: true}
  }, {
    timestamps: true
  });

  return mongooseClient.model('presentations', presentations);
};
