'use strict';

var express = require('express'),
  http = require('http'),
  path = require('path'),
  settings = require('config'),
  ui = require('./lib/routes/ui'),
  blog = require('./lib/routes/templating/main'),
  es = require('./lib/routes/es');


var opts = {
  logstash: {
    udp: true,         // or send directly over UDP
    host: '127.0.0.1', // defaults to localhost
    port: 9999, // defaults to 6379 for redis, 9999 for udp
  }
};

var logger = require('bucker').createLogger(opts, module);

var env = process.env.NODE_ENV || 'development';
var app = express();

app.set('node_port', settings.node_port);
app.set('elasticsearch_port', settings.elasticsearch_port);

// use dev to get the nice colored styling for http requests
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.bodyParser());
app.use(logger.middleware());
app.use(es.app);
app.use(blog.app);
app.use(ui.app);

http.createServer(app).listen(app.get('node_port'), function() {
  console.log('Express server listening on port ' + app.get('node_port'));
});