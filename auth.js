// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
//var dotenv      = require('dotenv').config();

//validate the the username and password
passport.use(new BasicStrategy(
    function(username, password, done) {
        console.log(process.env.theUsername);
        var user = { name: process.env.theUsername, password:  process.env.password};
        if (username == process.env.theUsername && password == process.env.password)
        {
            return done(null, user);
        }
        else
        {
            return done(null, false);
        }
    }
));

//exprot the result
exports.isAuthenticated = passport.authenticate('basic', { session : false });