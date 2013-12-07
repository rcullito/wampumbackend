var express = require('express'),
	superagent = require('superagent');


exports = module.exports;
var app = exports.app = express();

var base = 'http://localhost:9200';

// get everything in the stuff index
var searchAll = function(index, type, callback) {
	var url;
	if (type) {
		url = base + '/' + index + '/' + type + '/_search';
	} else {
		url = base + '/' + index + '/_search';
	}
	console.log(url);
	superagent
	.get(url)
	.end(function(err, res) {
		if (err) {
			console.log(err);
		}
		callback(res.body.hits.hits);
	})
};


app.get('/searchAll/:index/:type?', function(req, res) {
	var index = req.param('index');
	var type = req.param('type');
	searchAll(index, type, function(es_response) {
		res.send(es_response);
	})
});


// build a function to list all types for a given index


