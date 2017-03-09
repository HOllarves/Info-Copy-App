"use strict";

var express = require('express'),
    bodyParser = require('body-parser'),
    csvConverter = require('csvtojson'),
    basicAuth = require('basicauth-middleware'),
    basicAuthMiddleware = basicAuth('admin', 'x23i7EzOkdW8?&9'),
    jsonParser = bodyParser.json(),
    CsvService = express.Router()

CsvService.post('/orders', basicAuthMiddleware, jsonParser, (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        res.send("Empty or invalid body data")
    } else {
        res.send("Success " + JSON.stringify(req.body))
        console.log("Body = ", req.body)
    }
})

/**
 * 
 * MODULE EXPORTS
 * 
 */

module.exports = CsvService