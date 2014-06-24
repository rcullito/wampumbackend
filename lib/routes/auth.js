var express = require('express'),
    settings = require('config'),
    path = require('path'),
    _ = require('lodash'),
    elasticsearch = require('elasticsearch'),
    util = require('../util');

exports = module.exports;
var app = exports.app = express();

var WAMPUM_INDEX_FILE = path.join(__dirname, '..', '..', 'static', 'ui', 'wampumfrontend', 'dist', 'index.html');

var userExists = function (email, callback) {
  esClient.search({
    index: 'users',
    type: 'accounts',
    body: {
        filter: {
            term: {
                'email': email
            }
        }
    }
  }, function (es_err, es_res) {
    if (es_err) {
      callback(es_err);
    }

    var account = _.first(es_res.hits.hits) || false;
    callback(null, account);
  });
};

exports.userExists = userExists;

var esClient = new elasticsearch.Client({
  host: util.set_es_endpoint(),
});

app.post('/signup', function (req, res) {

  var email = req.param('email'),
    password = req.param('password');

  // DO THIS AT THE END OF THE ROUTE
  req.session.user = {
    email: email
  };

  userExists(email, function (es_err, account) { 
    if (es_err) {
      console.log(es_err);
      res.send(500, 'Error storing account information');
    }

    if (account) {
      res.send(500, 'That account already exists. Please login if this is you.')
    }

  });

  esClient.create({
    index: 'users',
    type: 'accounts',
    body: {
      email: email,
      password: password
    }
  }, function (es_err, es_res) {
    if (es_err) {
      console.log(es_err);
      return res.send(500, 'Error creating account.');
    }
    res.json(es_res);

  });
});

app.get('/login', function (req, res) {
  res.sendfile(WAMPUM_INDEX_FILE);
});

app.post('/login', function (req, res) {
  var email = req.param('email'),
    password = req.param('password');

  userExists(email, function (es_err, account) { 
    if (es_err) {
      console.log(es_err);
      res.send(500, 'Error retrieving account information');
    }
    if (!account) {
      return res.send(500, 'Incorrect email, please try again.')
    }

    if (_.isEqual(password, account._source.password)) {
      // return the id so that we can use it for account information
      res.json(account);
    } else {
      res.send(500, 'Incorrect password, please try again.')
    };
  });
});

