var mongoose = require('mongoose');

var ValidTokenSchema = new mongoose.Schema({
  value: String,
  userId: String
});

module.exports = mongoose.model('ValidToken', ValidTokenSchema);