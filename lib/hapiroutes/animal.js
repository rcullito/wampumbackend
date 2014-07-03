var Hapi = require("hapi"),
  Joi = require("joi");

exports = module.exports;

var animalConfig = {
  handler: function (request, reply) {
    var species = request.params.species,
      id = request.params.id;

    reply({
      species: species,
      id: id
    });
  },
  validate: {
    params: {
      species: Joi.string().valid(["dog", "horse", "buffalo", "cow"]),
      id: Joi.number()
    }
  }
};

var route = {
  path: "/v1/animals/{species}/{id}",
  method: "GET",
  config: animalConfig,
}

exports.route = route;