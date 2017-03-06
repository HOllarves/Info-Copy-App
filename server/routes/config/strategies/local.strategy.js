'use strict';

/**
 * 
 * REQUIRES
 * 
 */

var passport = require('passport'),
    mongoose = require('mongoose'),
    rfr = require('rfr'),
    User = rfr('server/models/User.js'),
    LocalStrategy = require('passport-local').Strategy

/**
 * 
 * MODULE EXPORTS
 * 
 */

module.exports = passLocalStrategy


/**
 * 
 * Validates User
 *
 */

function passLocalStrategy() {
    passport.use('local', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function (email, password, done) {
            User.authenticate(email, password, function (err, user) {
                if (err) {
                    return done(err)
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Invalid email or password.'
                    })
                }
                return done(null, user)
            })
        }
    ))
}
