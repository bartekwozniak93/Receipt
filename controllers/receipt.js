var Receipt = require('../models/receipt');
var Event = require('../models/event');

exports.newReceipt = function (req, res) {
    var ObjectId = require('mongoose').Types.ObjectId;
    var receipt = new Receipt();
    receipt.title = req.body.title;
    receipt.date = req.body.date;
    receipt.userId = new ObjectId(req.user._id);
    receipt.eventId = req.body.eventId;
    receipt.description = req.body.description;
    receipt.total = req.body.total;
    if (req.body.users != undefined) {
        var arr = JSON.parse(req.body.users);
        for (var i = 0; i < arr.length; i++) {
            receipt.users.push(arr[i]);
        }
    }
    receipt.save(function (err) {
        if (err)
            console.log(err);
        res.json(receipt);
    });
};

exports.getReceipts = function (req, res) {
    Receipt.find({eventId: req.body.eventId}, function (err, receipts) {
        if (!receipts) {
            res.json('There is no receipts.');
        } else {
            res.json({"receipts": receipts});
        }
    });
};


exports.getReceipt = function (req, res) {
    Receipt.findOne({_id: req.body.receiptId})
        .populate('users')
        .exec(function (err, receipt) {
            if (!receipt) {
                res.json('There is no receipt.');
            } else {
                Event.findOne({_id: receipt.eventId})
                    .populate('users')
                    .exec(function (err, event) {
                        if (event) {
                            res.json({"receipt": receipt, "users": event.users});
                        } else {
                            res.json({"receipt": receipt, "users": []});
                        }
                    });
            }
        });
};

exports.editReceipt = function (req, res) {
    Receipt.findOne({_id: req.body.receiptId}, function (err, receipt) {
        if (receipt) {
            receipt.title = req.body.title;
            receipt.description = req.body.description;
            receipt.total = req.body.total;
            receipt.users = [];
            var arr = JSON.parse(req.body.users);
            for (var i = 0; i < arr.length; i++) {
                receipt.users.push(arr[i]);
            }
            receipt.save(function (err) {
                if (err)
                    console.log(err);
                res.json({"receipt": receipt});
            });
        } else {
            res.json('There is no receipt.');
        }
    });
};


exports.getBalance = function (req, res) {////
    Receipt.find({eventId: req.body.eventId})
        .populate('users', 'userId')
        .exec(function (err, receipts) {
            if (!receipts) {
                res.json('There are no receipt.');
            } else {
                Event.findOne({_id: req.body.eventId})
                    .populate('users')
                    .exec(function (err, event) {
                        if (!event)
                            res.json("There is no such event");
                        else {
                            var balance = {};
                            for (var i = 0; i < event.users.length; i++) {
                                balance[event.users[i]._id] = {};
                                balance[event.users[i]._id]['spent'] = 0;
                                balance[event.users[i]._id]['cost'] = 0;
                                balance[event.users[i]._id]['balance'] = {};
                                for (var j = 0; j < event.users.length; j++) {
                                    balance[event.users[i]._id]['balance'][event.users[j]._id] = 0;

                                }
                            }
                            for (var i = 0; i < receipts.length; i++) {
                                balance[receipts[i].userId]['spent'] += receipts[i].total;
                                var totalToSplit = receipts[i].total / receipts[i].users.length;
                                for (var j = 0; j < receipts[i].users.length; j++) {
                                    if (!receipts[i].userId.equals(receipts[i].users[j]._id)) {
                                        balance[receipts[i].userId]['balance'][receipts[i].users[j]._id] += totalToSplit;
                                        balance[receipts[i].users[j]._id]['cost'] += totalToSplit;
                                    }
                                }
                            }
                            res.json(balance);
                        }
                    });
            }
        });
};
