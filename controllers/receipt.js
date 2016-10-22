var Receipt = require('../models/receipt');

exports.newReceipt = function(req, res) {
    var receipt = new Receipt();
    receipt.title=req.body.title;
    receipt.date=req.body.date;
    receipt.eventId=req.body.eventId;
    receipt.description=req.body.description;
    receipt.total=req.body.total;
        receipt.users.push(req.body.users[0]);

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




