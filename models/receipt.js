var mongoose = require('mongoose');
var EventSchema = new mongoose.Schema({
    title: String,
    date: String,
    description: String,
    users: [{type: mongoose.Schema.ObjectId, ref: 'User', unique: true}],
    elements: [{
        title: String,
        date: String,
        description: String,
        price: Number,
        users: [{type: mongoose.Schema.ObjectId, ref: 'User', unique: true}]
    }]
});


module.exports = mongoose.model('Receipt', EventSchema);