'use strict';

var express = require('express'),
  http = require('http'),
  settings = require('config');

var app = express();

app.set('port', settings.port);
// use dev to get the nice colored styling for http requests
app.use(express.logger('dev'));

app.get('/', function(req, res) {
  res.sen('welcome to wampum');
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});