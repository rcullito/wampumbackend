var Hapi = require("hapi"),
  Joi = require("joi"),
  settings = require('config'),
  _ = require('lodash'),
  esutil = require('../esutil');

var shippingConfig = {
  handler: function (request, reply) {
    esutil.esClient.create({
      index: 'darwins',
      type: 'shipping',
      body: {
        full_name: request.payload.full_name,        
        email: request.payload.email,             
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
      full_name: Joi.string().required(),
      email: Joi.string().email().required(),                  
    }
  }
};

var route = {
  path: "/submitshipping",
  method: "POST",
  config: shippingConfig,
};

exports.route = route;