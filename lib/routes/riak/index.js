'use strict';
var express = require('express'),
    riaktor = require('riaktor');

exports = module.exports;

var app = exports.app = express();


var db = Object.create(riaktor);

db.init_config('localhost', '8098');
db.about_my_config();
db.ping(function(res) {
  console.log(res);
})

app.post('/db/email', function(req, res) {
  var bucket = 'emails';
  var data = {email: req.params('email') };
  db.post_value_to_key('emails', key??, )
})
