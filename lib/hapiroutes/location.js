var Hapi = require("hapi"),
  Joi = require("joi"),
  settings = require('config'),
  _ = require('lodash'),
  esutil = require('../esutil');

exports = module.exports;

var locationConfig = {
  handler: function (request, reply) {
    // change this to be a  part of the path
    var locationid = request.params.locationid;
    esutil.getById('stuff', 'clothing', locationid, function (es_err, es_res) {
      if (es_err) {
        reply(Hapi.error.badRequest(es_err.message));
      }
      reply(es_res)
    });
  },
  validate: {
    params: {
      locationid: Joi.any().required()
    }
  }
};

var route = {
  path: "/location/{locationid}",
  method: "GET",
  config: locationConfig,
}

exports.route = route;