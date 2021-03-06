var mongoose = require('mongoose');
var EventSchema = new mongoose.Schema({
    title: String,
    date: String,
    description: String,
    latitude: Number,
    longitude: Number,
    users: [ {type : mongoose.Schema.ObjectId, "ref" : 'User', unique : true} ]
});


module.exports = mongoose.model('Event', EventSchema);