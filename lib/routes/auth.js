var express = require('express'),
    settings = require('config'),
    path = require('path'),
    elasticsearch = require('elasticsearch'),
    util = require('../util');

exports = module.exports;
var app = exports.app = express();


var WAMPUM_INDEX_FILE = path.join(__dirname, '..', '..', 'static', 'ui', 'wampumfrontend', 'dist', 'index.html');
// pass us along to angular

// TODO change this to account and make a separte login route
app.get('/login', function (req, res) {
  res.sendfile(WAMPUM_INDEX_FILE);
});

var esClient = new elasticsearch.Client({
  host: util.set_es_endpoint(),
});


// if the user has signed up comign from an item page
// insert that item and location combo in the "intersted in table".
app.post('/signup', function (req, res) {

  var email = req.param('email');
  var password = req.param('password');

  req.session.user = {
    email: email
  };

  esClient.create({
    index: 'users',
    type: 'accounts',
    id: email,
    body: {
      email: email,
      password: password
    }
  }, function (es_err, es_res) {
    if (es_err) {
      console.log(es_err);
      return res.send(500, 'A user with that email already exists, please try a different email');
    }

    res.send(200, 'you are all singed up!');

  });
});

app.get('/checkLoginStatus', function (req, res) {
  res.send(req.session.user);
});

