'use strict';

var express = require('express'),
  http = require('http'),
  path = require('path'),
  settings = require('config'),
  ui = require('./lib/routes/ui');

var env = process.env.NODE_ENV || 'development';
var app = express();

if ('production' === env ) {
  app.set('port', settings.prod_port);
} else {
  app.set('port', settings.port);
}
// use dev to get the nice colored styling for http requests
app.use(express.static(path.join(__dirname, 'static')));

app.use(express.logger('dev'));
app.use(ui.app);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});