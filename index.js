var Hapi = require("hapi"),
  Good = require('good'),
  Tv = require('tv'),
  Joi = require("joi");


var server = new Hapi.Server(8888);

module.exports = server;

if (!module.parent) {

  var location = require('./lib/hapiroutes/location'),
    search = require('./lib/hapiroutes/search'),
    ui = require('./lib/hapiroutes/ui'),
    orders = require('./lib/hapiroutes/orders'),
    tags = require('./lib/hapiroutes/tags');  


  var goodOptions = {
    extendedRequests: true,
    subscribers: {
      'console': ['request', 'log', 'error'],
      './logs/': ['request', 'log', 'error']
    }
  };

  var tvOptions = {
    endpoint: '/debug/console',
    queryKey: 'debug'
  };

  var plugins = [
    {plugin: Good, options: goodOptions},
    {plugin: Tv, options: tvOptions},
  ];

  server.route(location.route);
  server.route(search.route);
  server.route(tags.routes);
  server.route(orders.route);
  server.route(ui.routes);

  // we want to know about the event, and whether it is legitimate, which we can do from the ua
  server.on("request", function(request, event, tags) {
    if (tags.cavaliers) {
      console.log(event.data);
    }
  });

  server.pack.register(plugins, function (err) {
    server.start(function() {
        console.log("Hapi server started @", server.info.uri);
    });
  });
}
