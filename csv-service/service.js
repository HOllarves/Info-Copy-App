"use strict"

var express = require('express'),
    bodyParser = require('body-parser'),
    csvConverter = require('csvtojson'),
    basicAuth = require('basicauth-middleware'),
    basicAuthMiddleware = basicAuth('admin', 'x23i7EzOkdW8?&9'),
    textParser = bodyParser.text(),
    CsvService = express.Router()

CsvService.post('/orders', basicAuthMiddleware, textParser, (req, res) => {
    console.log("Body = ", Object.keys(req.body).length);
    if (!req.body || Object.keys(req.body).length === 0) {
        console.log('Here!');
        res.json({
            status: 400,
            message: "The body is empty"
        })
    } else {
        console.log('here! shit')
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
                res.json({
                    status: 200,
                    body: jsonArr
                })
                console.log("Response = ", res)
            })
    }
})

/**
 * 
 * MODULE EXPORTS
 * 
 */

module.exports = CsvService