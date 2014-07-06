var Hapi = require("hapi"),
  Joi = require("joi");

var location = require('./lib/hapiroutes/location'),
  search = require('./lib/hapiroutes/search'),
  ui = require('./lib/hapiroutes/ui'),
  tags = require('./lib/hapiroutes/tags');

var server = new Hapi.Server(4010, "localhost");

server.route(location.route);
server.route(search.route);
server.route(tags.route);
server.route(ui.routes);


server.start(function() {
    console.log("Hapi server started @", server.info.uri);
});