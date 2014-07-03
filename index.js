var Hapi = require("hapi"),
  Joi = require("joi");

var animal = require('./lib/hapiroutes/animal'),
  user = require('./lib/hapiroutes/user');

var server = new Hapi.Server(4010, "localhost");

server.route(animal.route);
server.route(user.route);

server.start(function() {
    console.log("Hapi server started @", server.info.uri);
});