var express = require('express'),
	settings = require('config'),
	_ = require('lodash'),
	winston = require('winston'),
	superagent = require('superagent');


exports = module.exports;
var app = exports.app = express();
var env = process.env.NODE_ENV || 'development';

// var logger = require('bucker').createLogger(settings.logger_opts, module);

app.set('elasticsearch_port', settings.elasticsearch_port);


var es_port = app.get('elasticsearch_port');
var base = 'http://localhost:' + es_port;


var simplifyResults = function(obj) {
	var hits_array = obj.hits.hits;
	var max_score = obj.hits.max_score;
	var extended_hits_array = _.map(hits_array, function (hit) {
		var wampum_score = hit._score / max_score;
		hit._source.wampum_score = wampum_score;
		return hit;
	});

	return _.pluck(extended_hits_array, '_source');
};

var autoCompleteHelper = function (hits_array) {
	var unique_tags = _.chain(hits_array)
		.pluck('_source')
		.pluck('tags')
		.map(function(tags) {
			return tags.split(", ");
		})
		.flatten()
		.uniq()
		.map(function (tag) {
			return { tag: tag };
		})
		.value();

	return unique_tags;
};


var fuzzyQuery = function(index, search_term, callback) {

	var url = [base, index, '_search'].join('/');

	var query =
		{
		    "query": {
		        "bool": {
		            "should": [
		                {
		                    "match": {
		                        "tags": search_term
		                    }
		                },
		                {
		                    "match": {
		                        "tags": {
		                            "query": search_term,
		                            "fuzziness": "1",
		                            "prefix_length": 2
		                        }
		                    }
		                }
		            ]
		        }
		    }
		};
	superagent
		.get(url)
		.send(query)
		.end(function(err, res) {
			if (err) {
				return callback(err);
			}
			return callback(null, res.body);
		})
};


app.get('/autocomplete', function (req, res) {
	var url = [base, 'stuff/clothing/_search'].join('/');
	superagent
		.get(url)
		.end(function (err, superagentRes) {
			if (err) {
				return console.log(err);
			}
			var hits_array = superagentRes.body.hits.hits
			var unique_tags = autoCompleteHelper(hits_array);
			res.send(unique_tags);
		});
});

app.post('/clickevent', function (req, res) {
	var event_type = req.param('event_type');
	var event_value = req.param('event_value');
	winston.log('warn', event_type + '|' + event_value + '|' + req.headers.cookie);
	res.send(200);
});

app.get('/ping', function (req, res) {
	res.send(200, 'pong');
});


// have this be the main search function and then sub in other changes here

app.get('/search/:index/:searchterm', function(req, res) {
	var index = req.param('index');
	var searchterm = req.param('searchterm');
	winston.log('warn', 'search|' + searchterm + '|' + req.headers.cookie);
	fuzzyQuery(index, searchterm, function(err, es_response) {
		if (err) {
			console.log(err);
			return res.send([]);
		}
		var sources = simplifyResults(es_response);
		var interactive_sources = _.map(sources, function(source) {
			if (_.has(source, 'dropoff_instructions')) {
				source['actions'] = ['find locations'];
			}
			return source;
		});
		res.send(interactive_sources);
	});
});
