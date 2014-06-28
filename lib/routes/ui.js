'use strict';
var express = require('express'),
  path = require('path');


exports = module.exports;

var app = exports.app = express();

var WAMPUM_INDEX_FILE = path.join(__dirname, '..', '..', 'static', 'ui', 'wampumfrontend', 'dest', 'index.html');
// for rationale behind sending index file, please see http://docs.angularjs.org/guide/dev_guide.services.$location

// change this to anything that does note begin with a v, which will be a convention for all api's
app.get('/', function(req, res) {
  res.sendfile(WAMPUM_INDEX_FILE);
});


app.use(function(req, res){
res.sendfile(WAMPUM_INDEX_FILE);
});