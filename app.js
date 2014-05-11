'use strict';

var express = require('express'),
  http = require('http'),
  path = require('path'),
  redis = require('redis'),
  settings = require('config'),
  winston = require('winston'),
  ui = require('./lib/routes/ui'),
  es = require('./lib/routes/es');

require('winston-redis').Redis;

var winstonStream = {
  write: function(message, encoding){
    winston.info(message);
  }
};

var env = process.env.NODE_ENV || 'development';
var app = express();

var redis_transport_options = {
  channel:'creek'
};

winston.add(winston.transports.Redis, redis_transport_options)

app.set('node_port', settings.node_port);
app.set('elasticsearch_port', settings.elasticsearch_port);

express.logger.token('cookie', function(req, res) { 
  return req.headers['cookie'];
})

express.logger.default = ':remote-addr - - [:date] ":method :url :cookie HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'

var sessionOptions = {secret: 'claire'};

var RedisStore = require('connect-redis')(express);
var redisSessionStoreOptions = {
  'host': settings.redis.sessionstore.host,
  'port': settings.redis.sessionstore.port,
  'ttl': settings.redis.sessionstore.ttl,
};

sessionOptions.store = new RedisStore(redisSessionStoreOptions);

// use dev to get the nice colored styling for http requests
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.bodyParser());

app.use(express.logger({stream:winstonStream}));

app.use(express.cookieParser());
app.use(express.session(sessionOptions));
app.use(es.app);
app.use(ui.app);

http.createServer(app).listen(app.get('node_port'), function() {
  console.log('Express server listening on port ' + app.get('node_port'));
});