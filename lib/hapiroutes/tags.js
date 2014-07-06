var Hapi = require("hapi"),
  Joi = require("joi"),
  settings = require('config'),
  _ = require('lodash'),
  esutil = require('../esutil');


var fieldsQuery = { fields: [ "tags" ] };

var tagsHelper = function (hits_array) {
  var unique_tags = _.chain(hits_array)
    .map(function(hit) {
      var tags_array = _.first(hit.fields.tags);
      return  tags_array.split(", ");
    })
    .flatten()
    .uniq()
    .map(function (tag) {
      return { tag: tag };
    })
    .value();

  return unique_tags;
};

var uniqueTags = function (callback) {
  esutil.search('stuff', 'clothing', fieldsQuery, function (err, res) {
    if (err) {
      return callback(err);
    }
    var unique_tags = tagsHelper(res.hits.hits);
    return callback(null, unique_tags);
  });
}

var tagsConfig = {
  handler: function (request, reply) {
    uniqueTags(function (err, tags) {
      if (err) {
        reply(Hapi.error.badRequest(err));
      }
      reply(tags);
    });
  }
};

var route = {
  path: "/tags",
  method: "GET",
  config: tagsConfig,
}

exports.route = route;
