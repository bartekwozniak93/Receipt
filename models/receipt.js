var mongoose = require('mongoose');
var ReceiptSchema = new mongoose.Schema({
    title: String,
    date: String,
    description: String,
    eventId: {type: mongoose.Schema.ObjectId, ref: 'Event'},
    users: [{type: mongoose.Schema.ObjectId, ref: 'User', unique: true}],
    elements: [{
        title: String,
        date: String,
        description: String,
        price: Number,
        users: [{type: mongoose.Schema.ObjectId, ref: 'User', unique: true}]
    }]
});


module.exports = mongoose.model('Receipt', ReceiptSchema);