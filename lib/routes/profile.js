var express = require('express'),
    settings = require('config'),
    path = require('path'),
    _ = require('lodash'),
    elasticsearch = require('elasticsearch'),
    util = require('../util');

exports = module.exports;
var app = exports.app = express();

var esClient = new elasticsearch.Client({
  host: util.set_es_endpoint(),
});

var getUserById = function (userid, callback) {
  esClient.get({
  index: 'users',
  type: 'accounts',
  id: userid
  }, function (err, res) {
    if (err) {
      return callback(err);
    }
    return callback(null, res);
  });
};

exports.getUserById = getUserById;

app.get('/user', function (req, res) {
  var userid = req.param('userid');
  getUserById(userid, function (es_err, es_res) {
    if (es_err) {
      res.send(es_err);
    }
    res.send(es_res);
  });
});
