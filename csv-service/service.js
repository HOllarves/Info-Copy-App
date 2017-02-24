"use strict"

var express = require('express'),
    bodyParser = require('body-parser'),
    csvConverter = require('csvtojson'),
    basicAuth = require('basicauth-middleware'),
    basicAuthMiddleware = basicAuth('admin', 'supersecret'),
    textParser = bodyParser.text(),
    CsvService = express.Router()

CsvService.post('/orders', basicAuthMiddleware, textParser, (req, res) => {
    csvConverter({
            noheader: false,
            headers: ['tracking_number', 'amount', 'user_id', 'status']
        }).fromString(req.body)
        .on('end_parsed', (jsonArr) => {
            res.json({
                status: 200,
                body: jsonArr
            })
        })
})

/**
 * 
 * MODULE EXPORTS
 * 
 */

module.exports = CsvService