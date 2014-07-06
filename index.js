var Hapi = require("hapi"),
  Joi = require("joi");

var location = require('./lib/hapiroutes/location');

var server = new Hapi.Server(4010, "localhost");

server.route(location.route);

server.start(function() {
    console.log("Hapi server started @", server.info.uri);
});