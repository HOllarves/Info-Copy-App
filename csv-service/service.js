"use strict"

var express = require('express'),
    bodyParser = require('body-parser'),
    csvConverter = require('csvtojson'),
    textParser = bodyParser.text(),
    CsvService = express.Router()

CsvService.post('/', textParser, (req, res) => {
    csvConverter({
            noheader: false,
            headers: ['user', 'email', 'company', 'userId']
        }).fromString(req.body)
        .on('json', (jsonRow, rowIndex) => {
            console.log("Row #" + rowIndex, jsonRow)
        })
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