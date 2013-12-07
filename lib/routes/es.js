var express = require('express'),
	_ = require('lodash'),
	superagent = require('superagent');


exports = module.exports;
var app = exports.app = express();

var base = 'http://localhost:9200';

var searchAll = function(index, type, callback) {
	var url;
	if (type) {
		url = [base, index, type, '_search'].join('/');
	} else {
		url = [base, index, '_search'].join('/');
	}
	superagent
	.get(url)
	.end(function(err, res) {
		if (err) {
			console.log(err);
		}
		callback(res.body.hits.hits);
	})
};

var getTypes = function(index, callback) {
	var url = [base, index, '_mapping'].join('/');
	superagent
		.get(url)
		.end(function(err, res) {
			if (err) {
				console.log(err);
			}
			var current_index = res.body[index];
			var types = _.keys(current_index);
			callback(types);
		})
};


app.get('/searchAll/:index/:type?', function(req, res) {
	var index = req.param('index');
	var type = req.param('type');
	searchAll(index, type, function(es_response) {
		res.send(es_response);
	})
});

app.get('/getTypes/:index', function(req, res) {
	var index = req.param('index');
	getTypes(index, function(es_response) {
		res.send(es_response);
	})
})

