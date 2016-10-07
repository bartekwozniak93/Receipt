var Event = require('../models/event');


exports.newEvent = function(req, res) {
            var event = new Event();
            event.title=req.body.title;
            event.date=req.body.date;
            event.description=req.body.description;
            event.save(function(err) {
                if (err)
                    console.log(err);
            });
            event.users.push({_id:req.user._id})
    res.json(event);

};

exports.addUserToEvent = function(req, res) {
    Event.findOne({ _id: req.body.eventId }, function(err, event) {
        if (!event) {
            res.json('There is not such event.');
        } else {
            event.users.push({_id: req.user._id});
            res.json(event);
        }
    });
};

