var Event = require('../models/event');
var User = require('../models/user');


exports.newEvent = function(req, res) {
            var event = new Event();
            event.title=req.body.title;
            event.date=req.body.date;
            event.description=req.body.description;
            event.latitude=req.body.latitude;
            event.longitude=req.body.longitude;
            event.save(function(err) {
                if (err)
                    console.log(err);
            });
            event.users.push({_id:req.user._id})
    res.json(event);
};

exports.addUserToEvent = function(req, res) {
    Event.findOne({ _id: req.body.eventId })
        .exec(function(err, event) {
            if (!event) {
                res.json('QrCode is incorrect.');
            } else {
                    User.findOne({ 'local.email': req.body.userToAdd }, function(err, user) {
                        if (user) {
                            var result = false;
                            for(var i = 0; i<event.users.length; i++) {
                                if(event.users[i].equals(user._id)) {
                                    result = true;
                                    break;
                                }
                            }
                            if(result) {
                                res.json('Event: '+event.title+' is already added.');
                            }
                            else {
                                event.users.push(user);
                                event.save(function (err) {
                                    if (err)
                                        res.json(err);
                                });
                                res.json('Event: '+event.title+' added successfully.');
                            }
                        }
                        else {
                            res.json('Internal error.');
                        }
                    });
            }
        });


};


exports.getEvents = function(req, res) {
    Event.find({ 'users': req.user._id }, function(err, events) {
        if (!events) {
            res.json('There is no events.');
        } else {
            res.json({"events":events});
        }
    });
};



exports.getEvent = function(req, res) {
    Event.find({ _id: req.body.eventId })
        .populate('users')
        .exec(function(err, event) {
            if (!event) {
                res.json('There is no events.');
            } else {
                res.json({"event":event});
            }
        });
};

