var Receipt = require('../models/receipt');
var Event = require('../models/event');

exports.newReceipt = function(req, res) {
    var receipt = new Receipt();
    receipt.title=req.body.title;
    receipt.date=req.body.date;
    receipt.userId= req.user._id;
    receipt.eventId=req.body.eventId;
    receipt.description=req.body.description;
    receipt.total=req.body.total;
    if(req.body.users!=undefined) {
        var arr = JSON.parse(req.body.users);
        for (var i = 0; i < arr.length; i++) {
            receipt.users.push(arr[i]);
        }
    }
    receipt.save(function(err) {
        if (err)
            console.log(err);
        res.json(receipt);
    });
};

exports.getReceipts = function(req, res) {
    Receipt.find({ eventId: req.body.eventId }, function(err, receipts) {
        if (!receipts) {
            res.json('There is no receipts.');
        } else {
            res.json({"receipts":receipts});
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
                            res.json({"receipt": receipt, "users":[]});
                        }
                    });
            }
        });
};

exports.editReceipt = function(req, res) {
    Receipt.findOne({ _id: req.body.receiptId }, function(err, receipt) {
        if (receipt) {
            receipt.title=req.body.title;
            receipt.description=req.body.description;
            receipt.total=req.body.total;
            receipt.users=[];
            var arr = JSON.parse(req.body.users);
            for(var i = 0; i<arr.length; i++) {
                receipt.users.push(arr[i]);
            }
            receipt.save(function(err) {
                if (err)
                    console.log(err);
                res.json({"receipt":receipt});
            });
        } else {
            res.json('There is no receipt.');
        }
    });
};


exports.getBalance = function (req, res) {////
    Receipt.find({eventId: req.body.eventId})
        .populate('users')
        .exec(function (err, receipts) {
            if (!receipts) {
                res.json('There are no receipt.');
            } else {
                Event.findOne({_id: req.body.eventId})
                    .populate('users')
                    .exec(function (err, event) {
                        var usersToSplit = new Array();
                        var balance={};
                        var temp;
                        for(var i = 0; i<event.users.length; i++) {
                            balance[event.users[i]._id] =[];
                            for(var j = 0; j<event.users.length; j++) {
                                temp={};
                                temp[event.users[j]._id]=0;
                                balance[event.users[i]._id].push(temp);
                            }
                        }
                        res.json(balance);
                        for(var i = 0; i<receipts.length; i++) {
                            for(var j = 0; j<receipts[i].users.length; j++) {
                                var totalToSplit= receipts[i].total / receipts[i].users.length;
                                balance[receipts[i].userId][receipts[i].users[j]._id] +=totalToSplit;
                            }
                        }


                        res.json(balance);
                    });
            }
        });
};//
