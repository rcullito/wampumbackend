var Hapi = require("hapi"),
  Joi = require("joi"),
  settings = require('config'),
  _ = require('lodash'),
  elasticsearch = require('elasticsearch'),
  util = require('../util');

exports = module.exports;

var userConfig = {
  handler: function (request, reply) {
    // change this to be a  part of the path
    var userid = request.query.userid;
    util.getById('users', 'accounts', userid, function (es_err, es_res) {
      if (es_err) {
        reply(Hapi.error.badRequest(es_err.message));
      }
      reply(es_res)
    });
  },
  validate: {
    query: {
      id: Joi.any().required()
    }
  }
};

var route = {
  path: "/user",
  method: "GET",
  config: userConfig,
}

exports.route = route;