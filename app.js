'use strict';

var express = require('express'),
  http = require('http'),
  path = require('path'),
  settings = require('config'),
  ui = require('./lib/routes/ui'),
  blog = require('./lib/routes/templating/main'),
  es = require('./lib/routes/es');

var env = process.env.NODE_ENV || 'development';
var app = express();

app.set('node_port', settings.node_port);
app.set('elasticsearch_port', settings.elasticsearch_port);

// use dev to get the nice colored styling for http requests
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.bodyParser());
app.use(express.logger('dev'));
app.use(es.app);
app.use(blog.app);
app.use(ui.app);

http.createServer(app).listen(app.get('node_port'), function() {
  console.log('Express server listening on port ' + app.get('node_port'));
});