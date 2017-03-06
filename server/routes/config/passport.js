'use strict';

/**
 * 
 * REQUIRES
 * 
 */

var passport = require('passport'),
    rfr = require('rfr'),
    User = rfr('server/models/User.js')

/**
 * 
 * MODULE EXPORTS
 * 
 */

module.exports = passportImplementation

/**
 * 
 * It implementates passport in the application
 * 
 */

function passportImplementation(server) {
    //Initializing passport
    server.use(passport.initialize())
    //User serialization method
    passport.serializeUser(function (user, done) {
        done(null, user)
    })
    //User deserialization method
    passport.deserializeUser(function (id, done) {
        User.findById(id, done)
    })
    //Requiring local strategy
    require('./strategies/local.strategy.js')()
}