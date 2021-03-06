var User = require('../models/user');
var Event = require('../models/event');
var config = require('../config');

exports.postUsers = function(req, res, next) {
    User.findOne({ 'local.email': req.body.email }, function(err, user) {
        if (err)
            return done(err);
        if (user) {
            res.json('That email is already taken.');
        } else {
            user = new User();
            user.local.email = req.body.email;
            user.local.password = user.generateHash(req.body.password);
            user.save(function(err) {
                if (err)
                    res.send(err);

                req.user = user;
                next();
            });

        }
    });
};

exports.getUser= function(req, res) {
    User.findOne({ _id: req.user._id }, function(err, user) {
        if (!user) {
            res.end('There is no user.');
        } else {
            res.json(user._id);
        }
    });
};

exports.findUsers = function (req, res) {
    Event.findOne({_id: req.body.eventId})
        .populate('users._id')
        .exec(function (err, event) {
            if (!event || err || !event.users) {
                res.json('');
            }
            else {
                User.find({
                    $and: [{
                        'local.email': {
                            $regex: req.body.email,
                            $options: "i"
                        }
                    }, {_id: {$nin: event.users}}]
                }, function (err, users) {
                    if (!users || err) {
                        res.json('');
                    }
                    res.json(users);
                });
            }
        });
};




exports.postFacebookUser = function(req, res, next) {
    User.findOne({ 'facebook.email': req.body.email }, function(err, user) {
        if (err)
            return done(err);
        if (user) {
            req.user = user;
            next();
        } else {
            user = new User();
            user.local.email = req.body.email;
            user.facebook.email= req.body.email;
            user.save(function(err) {
                if (err)
                    res.send(err);

                req.user = user;
                next();
            });

        }
    });
};
