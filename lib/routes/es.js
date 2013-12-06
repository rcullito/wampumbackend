var express = require('express'),
	superagent = require('superagent');


exports = module.exports;
var app = exports.app = express();

var base = 'http://localhost:9200/stuff';

// get everything in the stuff index
var getAllStuff = function(callback) {
	var url = base + '/_search';
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


app.get('/allStuff', function(req, res) {
	getAllStuff(function(es_response) {
		res.send(es_response);
	})
});
