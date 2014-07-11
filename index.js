var Hapi = require("hapi"),
  Good = require('good'),
  Joi = require("joi");

var location = require('./lib/hapiroutes/location'),
  search = require('./lib/hapiroutes/search'),
  ui = require('./lib/hapiroutes/ui'),
  tags = require('./lib/hapiroutes/tags');


var server = new Hapi.Server(8888);

server.route(location.route);
server.route(search.route);
server.route(tags.route);
server.route(ui.routes);

var goodOptions = {
  extendedRequests: true,
  subscribers: {
      'console': ['request', 'log', 'error'],
  }
};

var plugins = [
  {plugin: Good, options: goodOptions}
];

server.pack.register(plugins, function (err) {
  server.start(function() {
      console.log("Hapi server started @", server.info.uri);
  });
});