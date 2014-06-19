var settings = require('config');

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

