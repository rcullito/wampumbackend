'use strict';

var express = require('express'),
  http = require('http'),
  path = require('path'),
  redis = require('redis'),
  settings = require('config'),
  ui = require('./lib/routes/ui'),
  es = require('./lib/routes/es');


var logger = require('bucker').createLogger(settings.logger_opts, module);

var env = process.env.NODE_ENV || 'development';
var app = express();

app.set('node_port', settings.node_port);
app.set('elasticsearch_port', settings.elasticsearch_port);

// use dev to get the nice colored styling for http requests
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.bodyParser());
app.use(logger.middleware());
app.use(es.app);
app.use(ui.app);

http.createServer(app).listen(app.get('node_port'), function() {
  console.log('Express server listening on port ' + app.get('node_port'));
});