/*
Load required packages
 */
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');

/*
 Load controllers
 */
var userController = require('./controllers/user');
var authController = require('./controllers/auth');
var eventController = require('./controllers/event');
var receiptController = require('./controllers/receipt');
/*
 Load configuration from config.js
 */
var config = require('./config');

/*
 Connect to Mongo DataBase
 */
mongoose.connect(config.dbconnection);


var app = express();
app.use(passport.initialize());
app.use(bodyParser.json({limit: '2mb'}));
app.use(bodyParser.urlencoded({limit: '2mb', extended: true}));

/*
 Serialize user into session by Passport
 */
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

/*
 Deserialize user from session by Passport
 */
passport.deserializeUser(function(user, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

/*
 Definitions of application end points
 */
var router = express.Router();

router.route('/local/users')
    .post(userController.postUsers, authController.generateToken)
    .get(authController.isJWTAuthenticated, userController.getUser);

router.route('/local/find')
    .post(authController.isJWTAuthenticated, userController.findUsers);

router.route('/local/login')
    .post(authController.authenticateLocal, authController.generateToken);

router.route('/local/logout')
    .post(authController.isJWTAuthenticated, authController.logout);

router.route('/facebook/login')
    .post(userController.postFacebookUser, authController.generateToken);

router.route('/event')
    .post(authController.isJWTAuthenticated, eventController.newEvent)
    .get(authController.isJWTAuthenticated, eventController.getEvents);

router.route('/event/adduser')
    .post(authController.isJWTAuthenticated, eventController.addUserToEvent);

router.route('/getevent')
    .post(authController.isJWTAuthenticated, eventController.getEvent);

router.route('/receipt')
    .post(authController.isJWTAuthenticated, receiptController.newReceipt);

router.route('/receipts')
    .post(authController.isJWTAuthenticated, receiptController.getReceipts);

router.route('/getReceipt')
    .post(authController.isJWTAuthenticated, receiptController.getReceipt);




app.use('/api', router);
var port = Number(process.env.PORT || 8081);
app.listen(port);
