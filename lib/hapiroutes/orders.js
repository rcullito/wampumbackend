var Hapi = require("hapi"),
  Joi = require("joi"),
  settings = require('config'),
  _ = require('lodash'),
  esutil = require('../esutil');

var shippingConfig = {
  handler: function (request, reply) {
    esutil.esClient.create({
      index: 'orders',
      type: 'shipping',
      body: {
        locationid: request.payload.locationid,
        item: request.payload.item,
        address_line_1: request.payload.address_line_1,
        address_line_2: request.payload.address_line_2,
        city: request.payload.city,
        state: request.payload.state,
        zip: request.payload.zip,
        email: request.payload.email
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
      locationid: Joi.any().required(),
      item: Joi.string(),
      address_line_1: Joi.string().required(),
      address_line_2: Joi.any(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zip: Joi.string().required(),
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