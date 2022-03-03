var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userModelSchema = new Schema({
  username: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  password: {type: String, required: true},
  movies: [{type: Schema.Types.ObjectId, ref: 'MovieModel'}]
});

module.exports = mongoose.model('UserModel', userModelSchema);