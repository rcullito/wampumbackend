var express = require('express'),
    settings = require('config'),
    path = require('path'),
    _ = require('lodash'),
    elasticsearch = require('elasticsearch'),
    util = require('../util');

exports = module.exports;
var app = exports.app = express();


var WAMPUM_INDEX_FILE = path.join(__dirname, '..', '..', 'static', 'ui', 'wampumfrontend', 'dist', 'index.html');
// pass us along to angular

app.get('/login', function (req, res) {
  res.sendfile(WAMPUM_INDEX_FILE);
});

var esClient = new elasticsearch.Client({
  host: util.set_es_endpoint(),
});

app.post('/signup', function (req, res) {

  var email = req.param('email'),
    password = req.param('password');

  req.session.user = {
    email: email
  };

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
      return res.send(500, 'A user with that email already exists, please try a different email, or log in if this is you.');
    }

    res.send(200, 'you are all singed up!');

  });
});

app.post('/login', function (req, res) {
    var email = req.param('email'),
      password = req.param('password');

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
        console.log(es_err);
        res.send(500, 'We were unable to find that email in our records.')
      }

      var account = _.first(es_res.hits.hits);

      if (_.isUndefined(account)) {
        console.log('here');
        return res.send(500, 'Incorrect email, please try again.')
      }

      if (_.isEqual(password, account._source.password)) {
        // return the id so that we can use it for account information
        res.send(200);
      } else {
        res.send(500, 'Incorrect password, please try again.')
      };
    });
});

app.get('/checkLoginStatus', function (req, res) {
  res.send(req.session.user);
});

