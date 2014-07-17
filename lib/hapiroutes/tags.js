var Hapi = require("hapi"),
  Joi = require("joi"),
  settings = require('config'),
  _ = require('lodash'),
  server = require("../../"),
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


var getTagsData = function(next) {
  uniqueTags(function (err, tags) {
    server.log(["es"], "Fetching tags data");
    if (err) {
      next(Hapi.error.badRequest(err));
    } else {
      next(null, tags);
    }
  });
};

SECOND = 36000000;
server.method('getTagsData', getTagsData, {
  cache: {
    expiresIn: SECOND * 2
  }
});

var tagsConfig = {
  handler: function (request, reply) {
    server.methods.getTagsData(function (error, result) {
      reply(error || result);
    });
  }
};

var itemListConfig = {
  handler: function (request, reply) {
    request.log(["cavaliers"], JSON.stringify({
      tag: 'cavaliers',
      itemlister: 'itemlister',
      ua: request.headers['user-agent'],
    }));    
    server.methods.getTagsData(function (error, result) {
      reply(error || result);
    });
  }
};

exports.routes = [
  {
    path: "/tags",
    method: "GET",
    config: tagsConfig,
  },
  {
    path: "/itemlistdata",
    method: "GET",
    config: itemListConfig,
  }
];
