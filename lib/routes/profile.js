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

app.get('/user', function (req, res) {
  var userid = req.param('userid');
  getById('users', 'accounts', userid, function (es_err, es_res) {
    if (es_err) {
      res.send(es_err);
    }
    res.send(es_res);
  });
});

app.get('/location', function (req, res) {
  var locationid = req.param('locationid');
  // TODO change type from clothing to something else before it gets too confusing
  // take advantage of mappings to give custom fields based on the type
  getById('stuff', 'clothing', locationid, function (es_err, es_res) {
    if (es_err) {
      res.send(es_err);
    }
    res.send(es_res);
  });
});


app.post('/submitshipping', function (req, res) {
  esClient.create({
    index: 'orders',
    type: 'shipping',
    body: {
      userid: req.param('userid') || '',
      locationid: req.param('locationid') || '',
      item_width: req.param('item_width') || '',
      item_height: req.param('item_height') || '',
      address_line_1: req.param('address_line_1') || '',
      address_line_2: req.param('address_line_2') || '',
      city: req.param('city') || '',
      state: req.param('state') || '',
      zip: req.param('zip') || '',
    }
  }, function (es_err, es_res) {
    if (es_err) {
      console.log(es_err);
      return res.send(500, 'Error placing order, we are sorry for the inconvenience');
    }
    res.json(es_res)
  });
});
