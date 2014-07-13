var settings = require('config'),
  elasticsearch = require('elasticsearch');

exports = module.exports;

var env = process.env.NODE_ENV || 'prod';

var set_es_endpoint = function () {
  if (env === 'dev') {
    return settings.elasticsearch.dev_host + ':' + settings.elasticsearch.port;
  } else {
    return settings.elasticsearch.host + ':' + settings.elasticsearch.port;
  }
}

exports.set_es_endpoint = set_es_endpoint;

var esClient = new elasticsearch.Client({
  host: set_es_endpoint(),
});

exports.esClient = esClient;

var getById = function (index, type, id, callback) {
  esClient.get({
  index: index,
  type: type,
  id: id
  }, function (err, res) {
    if (err) {
      return callback(err);
    }
    return callback(null, res);
  });
};

exports.getById = getById;

var search = function(index, type, queryBody, callback) {
  esClient.search({
    index: index,
    type: type,
    size: settings.elasticsearch.size,
    body: queryBody
  }).then(function (resp) {
    callback(null, resp);
  }, function (err) {
    callback(err);
  });
}

exports.search = search;



