var mongoose = require('mongoose');
var ReceiptSchema = new mongoose.Schema({
    title: String,
    date: String,
    description: String,
    total: Number,
    userId: {type: mongoose.Schema.ObjectId, ref: 'User'},
    eventId: {type: mongoose.Schema.ObjectId, ref: 'Event'},
    users: [{type: mongoose.Schema.ObjectId, ref: 'User', unique: true}]
});


module.exports = mongoose.model('Receipt', ReceiptSchema);