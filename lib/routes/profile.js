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
