"use strict"

var express = require('express'),
    bodyParser = require('body-parser'),
    csvConverter = require('csvtojson'),
    basicAuth = require('basicauth-middleware'),
    basicAuthMiddleware = basicAuth('admin', 'x23i7EzOkdW8?&9'),
    textParser = bodyParser.text(),
    CsvService = express.Router()

CsvService.post('/orders', basicAuthMiddleware, textParser, (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        res.send("Empty body, Content-Type " + req.get('content-type') + " " + "Authorization: " + req.get('Authorization'));
    } else {
        csvConverter({
                noheader: false,
                headers: ['tracking_number', 'amount', 'user_id', 'status']
            }).fromString(req.body)
            .on('done', (err) => {
                if (err) {
                    res.json({
                        status: 400,
                        body: "Parsing error " + err
                    })
                }
            })
            .on('end_parsed', (jsonArr) => {
                if (jsonArr) {
                    res.send("Success!" + jsonArr)
                    console.log(jsonArr)
                } else {
                    res.send("Error parsing")
                }
            })
    }
})

/**
 * 
 * MODULE EXPORTS
 * 
 */

module.exports = CsvService