var Receipt = require('../models/receipt');

exports.newReceipt = function(req, res) {
    var receipt = new Receipt();
    receipt.title=req.body.title;
    receipt.date=req.body.date;
    receipt.description=req.body.description;
    receipt.users.push({_id:req.user._id})
    receipt.save(function(err) {
        if (err)
            console.log(err);
    });
    res.json(receipt);
};

