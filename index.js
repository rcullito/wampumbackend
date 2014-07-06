var Hapi = require("hapi"),
  Joi = require("joi");

var location = require('./lib/hapiroutes/location'),
  search = require('./lib/hapiroutes/search'),
  tags = require('./lib/hapiroutes/tags');

var server = new Hapi.Server(4010, "localhost");

server.route(location.route);
server.route(search.route);
server.route(tags.route);

server.start(function() {
    console.log("Hapi server started @", server.info.uri);
});