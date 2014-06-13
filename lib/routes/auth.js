var express = require('express'),
    settings = require('config'),
    elasticsearch = require('elasticsearch');

exports = module.exports;
var app = exports.app = express();


app.get('/login', function(req, res) {
  res.sendfile('views/login.html');
});