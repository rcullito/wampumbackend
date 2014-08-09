var Hapi = require("hapi"),
  Joi = require("joi"),
  settings = require('config'),
  _ = require('lodash'),
  esutil = require('../esutil');

var locationsConfig = {
  handler: function (request, reply) {
    esutil.esClient.search({
      index: 'stuff',
      type: 'clothing',
      body: {
        size: 100,
      }
    }, function (es_err, es_res) {
      if (es_err) {
        console.log(es_err);
        reply(Hapi.error.badRequest(es_err.message));
      }

    var hits_array = es_res.hits.hits;
    var extended_hits_array = _.map(hits_array, function (hit, index) {
      var last_part_of_address = _.last(hit._source.mailingaddress.split('|'));
      var array_of_macro_geo = last_part_of_address.split(' ');
      var zip = _.last(array_of_macro_geo);
      hit._source.mailingaddress = _.pull(array_of_macro_geo, zip).join(' ');
      return hit;
    });

      reply(_.pluck(extended_hits_array, '_source'));
    });
  }
};

var route = {
  path: "/alllocations",
  method: "GET",
  config: locationsConfig,
};

exports.route = route;