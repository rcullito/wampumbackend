var Hapi = require("hapi"),
  Joi = require("joi"),
  settings = require('config'),
  _ = require('lodash'),
  esutil = require('../esutil');

var beginConfig = {
  handler: function (request, reply) {
    esutil.esClient.create({
      index: 'begin',
      type: 'choices',
      body: {
        clothingtype: request.payload.clothingtype,
        brand: request.payload.brand,
      }
    }, function (es_err, es_res) {
      if (es_err) {
        console.log(es_err);
        reply(Hapi.error.badRequest(es_err.message));
      }
      reply(es_res)
    });
  },
  validate: {
    payload: {
      clothingtype: Joi.string().required(),
      brand: Joi.string().required(),
    }
  }
};

var route = {
  path: "/begin",
  method: "POST",
  config: beginConfig,
};

exports.route = route;