var Hapi = require("hapi"),
  Good = require('good'),
  Joi = require("joi");


var server = new Hapi.Server(8888);

module.exports = server;

if (!module.parent) {

  var ui = require('./lib/hapiroutes/ui'),
    begin = require('./lib/hapiroutes/begin'),
    search = require('./lib/hapiroutes/search'),
    locations = require('./lib/hapiroutes/locations'),
    submit = require('./lib/hapiroutes/submit')  


  var goodOptions = {
    extendedRequests: true,
    subscribers: {
      'console': ['request', 'log', 'error'],
      // './logs/': ['request', 'log', 'error']
    }
  };

  var plugins = [
    {plugin: Good, options: goodOptions},
  ];

  server.route(begin.route);
  server.route(search.route);
  server.route(locations.route);
  server.route(submit.route);
  server.route(ui.routes);

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
