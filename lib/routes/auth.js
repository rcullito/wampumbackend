var express = require('express'),
    settings = require('config'),
    path = require('path'),
    elasticsearch = require('elasticsearch');

exports = module.exports;
var app = exports.app = express();


var WAMPUM_INDEX_FILE = path.join(__dirname, '..', '..', 'static', 'ui', 'wampumfrontend', 'dist', 'index.html');
// pass us along to angular
app.get('/login', function (req, res) {
  res.sendfile(WAMPUM_INDEX_FILE);
});

app.post('/register', function (req, res) {
    var username = req.param('username');
    var password = req.param('password');

})

