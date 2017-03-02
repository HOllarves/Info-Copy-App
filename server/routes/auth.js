"use strict";

/**
 * 
 * REQUIRES
 * 
 */

var express = require('express'),
  authRouter = express.Router(),
  rfr = require('rfr'),
  authCtrl = rfr('server/controllers/authController.js')




/**
 * Sign Up POST request
 * @param {String} url - endpoint
 * @param {Function} signUp - from AuthController
 */

authRouter.post('/signUp', authCtrl.signUp)

/**
 * Sign In POST request
 * @param {String} url - endpoint
 * @param {Function} signIn - from AuthController
 *
 */

authRouter.post('/signIn', authCtrl.signIn)

/**
 * 
 * MODULE EXPORTS
 * 
 */

module.exports = authRouter