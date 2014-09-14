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
        clothingtype: request.payload.clothingtype,
        brand: request.payload.brand,  
        locationid: request.payload.locationid,
        email: request.payload.email,        
        full_name: request.payload.full_name,     
        address_line_1: request.payload.address_line_1,
        address_line_2: request.payload.address_line_2,
        city: request.payload.city,
        state: request.payload.state,
        zip: request.payload.zip,
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
      locationid: Joi.any(),
      full_name: Joi.string().required(),
      email: Joi.string().email().required(),                  
      address_line_1: Joi.string().required(),
      address_line_2: Joi.any(),
      city: Joi.string().required(),
      state: Joi.string().required().invalid('State'),
      zip: Joi.string().required(),
    }
  }
};

var route = {
  path: "/submitshipping",
  method: "POST",
  config: shippingConfig,
};

exports.route = route;