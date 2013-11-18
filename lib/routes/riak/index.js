'use strict';
var express = require('express'),
    riaktor = require('riaktor');

exports = module.exports;

var app = exports.app = express();


var db = Object.create(riaktor);

db.init_config('localhost', '8098');
db.about_my_config();
