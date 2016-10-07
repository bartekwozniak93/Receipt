var mongoose = require('mongoose');
var EventSchema = new mongoose.Schema({
    title: String,
    date: String,
    description: String,
    users: [ {type : mongoose.Schema.ObjectId, ref : 'User'} ]
});


module.exports = mongoose.model('Event', EventSchema);