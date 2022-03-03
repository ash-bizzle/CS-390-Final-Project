var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var movieModelSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true, ref: 'UserModel'},
    name: {type: String, unique: true, required: true},
    releaseYear: {type: Number, required: true},
    runningTime: {type: Number, required: true},
    genre: {type: String, enum: ['Action', 'Adventure', 'Comedy', 'Crime', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'SciFi', 'Thriller']}
});

module.exports = mongoose.model('MovieModel', movieModelSchema);