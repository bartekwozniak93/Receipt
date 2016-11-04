var Receipt = require('../models/receipt');
var Event = require('../models/event');

exports.newReceipt = function (req, res) {
    var receipt = new Receipt();
    receipt.title = req.body.title;
    receipt.date = req.body.date;
    receipt.userId = req.user._id;
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


exports.getEventBalance = function (req, res) {
    Receipt.find({eventId: req.body.eventId})
        .populate([{
            path: 'userId',
            model: 'User'
        }, {
            path: 'users',
            model: 'User'
        }])
        .exec(function (err, receipts) {
            if (!receipts) {
                res.json('There are no receipt.');
            } else {
                Event.findOne({_id: req.body.eventId})
                    .populate({
                        path: 'users',
                        model: 'User'
                    })
                    .exec(function (err, event) {
                        if (!event)
                            res.json("There is no such event");
                        else {
                            var balance = {};
                            for (var i = 0; i < event.users.length; i++) {
                                balance[event.users[i].local.email] = {};
                                balance[event.users[i].local.email]['spent'] = 0;
                                balance[event.users[i].local.email]['cost'] = 0;
                                balance[event.users[i].local.email]['balance'] = {};
                                for (var j = 0; j < event.users.length; j++) {
                                    balance[event.users[i].local.email]['balance'][event.users[j].local.email] = 0;

                                }
                            }
                            for (var i = 0; i < receipts.length; i++) {
                                balance[receipts[i].userId.local.email]['spent'] += receipts[i].total;
                                var totalToSplit = receipts[i].total / receipts[i].users.length;
                                for (var j = 0; j < receipts[i].users.length; j++) {
                                    if (!receipts[i].userId._id.equals(receipts[i].users[j]._id)) {
                                        balance[receipts[i].userId.local.email]['balance'][receipts[i].users[j].local.email] += totalToSplit;
                                        balance[receipts[i].users[j].local.email]['balance'][receipts[i].userId.local.email] -= totalToSplit;
                                        balance[receipts[i].users[j].local.email]['cost'] += totalToSplit;
                                    }
                                }
                            }
                            res.json(balance);
                        }
                    });
            }
        });
};

exports.getUserBalance = function (req, res) {
    Receipt.find({ $or: [ { users: req.user._id }, { userId: req.user._id } ] })
        .populate([{
            path: 'eventId',
            model: 'Event'
        }, {
            path: 'users',
            model: 'User'
        }])
        .exec(function (err, receipts) {
            var balance = {};
            for (var i = 0; i < receipts.length; i++) {
                if(balance[receipts[i].eventId._id] == undefined) {
                    balance[receipts[i].eventId._id] = {};
                    balance[receipts[i].eventId._id]['balance']=0;
                    balance[receipts[i].eventId._id]['eventTitle'] =receipts[i].eventId.title;
                    balance[receipts[i].eventId._id]['eventDescription'] =receipts[i].eventId.description;
                }

                var totalToSplit = receipts[i].total / receipts[i].users.length;
                if(!receipts[i].userId.equals(req.user._id)) {
                    balance[receipts[i].eventId._id]['balance'] -= totalToSplit;
                }
                else{
                    var isUserSplittingCost=false;
                    for(var k = 0; k<receipts[i].users.length; k++) {
                        if (receipts[i].users[k]._id.equals(req.user._id)) {
                            isUserSplittingCost = true;
                            break;
                        }
                    }
                    if(isUserSplittingCost) {
                        balance[receipts[i].eventId._id]['balance'] += (receipts[i].total-totalToSplit);
                    }
                    else {
                        balance[receipts[i].eventId._id]['balance'] +=receipts[i].total;
                    }
                }
            }
            res.json(balance);
        });
};
