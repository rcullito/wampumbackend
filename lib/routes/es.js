var express = require('express'),
	settings = require('config'),
	_ = require('lodash'),
	superagent = require('superagent');


exports = module.exports;
var app = exports.app = express();
var env = process.env.NODE_ENV || 'development';

var logger = require('../../modified/bucker').createLogger(settings.logger_opts, module);

app.set('elasticsearch_port', settings.elasticsearch_port);


var es_port = app.get('elasticsearch_port');
// var base = 'http://localhost:' + es_port;
var base = 'http://ec2-54-87-156-147.compute-1.amazonaws.com:' + es_port;


var simplifyResults = function(obj) {
	var hits_array = obj.hits.hits;
	var max_score = obj.hits.max_score;
	var color_brewer = ['#f7fcf0', '#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081'];

	var extended_hits_array = _.map(hits_array, function (hit) {
		var wampum_score = hit._score / max_score;
		var color_helper = Math.round(wampum_score * 10) - 1;
		var wampum_color = color_brewer[color_helper];
		hit._source.wampum_score = wampum_score;
		hit._source.wampum_color = wampum_color;
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

// pass in req.headers.cookie
var stripSessionIdFromCookie = function (cookie) {
	var cookieBites = cookie.split(';');
  var connectsid = cookieBites[0];
  var cookieBits = connectsid.split('=');
  var sessionid = cookieBits[1];
  return sessionid;
};

// TODO use this function to get the session id into the clickevent on the server
// since state is easier to do and makes more sense to do client side
// generate the request id there and pass it up

app.post('/clickevent', function (req, res) {
	var event_type = req.param('event_type');
	var event_value = req.param('event_value');
	var requestid = req.param('requestid');
	var sessionid = stripSessionIdFromCookie(req.headers.cookie);

	// always set the request id
	if (requestid) {
		logger.tags([ event_type ]).info('dest=' + event_value + ' ' + 'sessionid=' + sessionid + ' ' + 'requestid=' + requestid );
	} else {
		logger.tags([ event_type ]).info('dest=' + event_value + ' ' + 'sessionid=' + sessionid );
	}
	
	res.send(200);
});

app.get('/ping', function (req, res) {
	res.send(200, 'pong');
});


// have this be the main search function and then sub in other changes here

app.get('/search/:index/:searchterm', function(req, res) {
	var index = req.param('index');
	var searchterm = req.param('searchterm');
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
