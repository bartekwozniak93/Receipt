var passport = require('passport');
var User = require('../models/user');
var ValidToken = require('../controllers/validToken');
var ValidTokenBase = require('../models/validToken');
var config = require('../config');
var nJwt = require('njwt');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;


exports.authenticateLocal = function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    if (email === undefined  || password === undefined ) {
        res.end('Login or password cannot be empty.');
    } else {
        User.findOne({ 'local.email': email }, function(err, user) {
            if (err) {
                res.send(err);
            }
            if (!user) {
                res.statusCode = 401;
                return res.json('Login or password is incorrect.');
            } else {
                var localUser = user.local;
                localUser.verifyPassword(password, function(err, isMatch) {
                    if (err) {
                        res.send(err);
                    }
                    if (!isMatch) {
                        res.statusCode = 401;
                        return res.json('Login or password is incorrect.');
                    }
                    req.user = user;
                    next();
                });
            }
        });

    }
};


exports.generateToken = function(req, res) {
    var token = nJwt.create({
        sub: req.user._id
    }, config.secret);
    token.setExpiration(new Date().getTime() + (config.expirationtime));
    ValidToken.postValidToken(token.compact(), req.user._id);
    res.json({user: req.user, token:token.compact()});
}

exports.logout = function(req, res) {
    ValidToken.deleteValidToken(req.headers.authorization.split(" ")[1]);
    res.json('Logout successfully.');
};

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.secret,
    strategy: ["HS256"],
    passReqToCallback: true
}, function(req, jwt_payload, done) {
    ValidTokenBase.findOne({ value: req.headers.authorization.split(" ")[1] }, function(err, validToken) {
        if (err) {
            return done(err, false);
        }
        if (validToken) {
            User.findOne({ _id: jwt_payload.sub }, function(err, user) {

                if (err) {
                    return done(err, false);
                }
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            });
        } else {
            done(null, false);
        }
    });
}));

exports.isJWTAuthenticated = passport.authenticate('jwt', { session: true });