var express = require('express'),
	settings = require('config'),
	_ = require('lodash'),
	superagent = require('superagent');


exports = module.exports;
var app = exports.app = express();
var env = process.env.NODE_ENV || 'development';

app.set('elasticsearch_port', settings.elasticsearch_port);


var es_port = app.get('elasticsearch_port');
var base = 'http://localhost:' + es_port;

var errorHelper = function(error) {
	if (error.code === 'ECONNREFUSED') {
		var message = 'Error connecting to elasticsearch on ' + base;
		console.log(message);
		return message;
	}
	// TODO add other common errors here as they arise
};

// may want to order by score or display score to increase transparency
var simplifyResults = function(obj) {
	var hits_array = obj.hits.hits;
	return _.pluck(hits_array, '_source');
};

var prefixQuery = function(index, prefix, callback) {

	var prefixWords = prefix.split(" ");
	var prefixLength = _.size(prefixWords);

	if (prefixLength > 1) {
		prefix = _.first(prefixWords);
	}

	var url = [base, index, '_search'].join('/');

	var query = 
	{
		"query": {
			"prefix": { "_all": prefix }
		}
	};
	superagent
		.get(url)
		.send(query)
		.end(function(err, res) {
			if (err) {
				return callback(err);
			}
			return callback(res.body);
		})
};
exports.prefixQuery = prefixQuery;


app.get('/autocomplete', function (req, res) {
	var url = [base, 'stuff/clothing/_search'].join('/');
	superagent
		.get(url)
		.end(function (err, superagentRes) {
			if (err) {
				return console.log(err);
			}
			var hits_array = superagentRes.body.hits.hits
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
			res.send(unique_tags);
		});
});

app.post('/eventcollector', function(req, res) {
	superagent
		.get('freegeoip.net/json/' + req.connection.remoteAddress)
		.end(function(err, superagent_res) {
		if (err) {
			res.send(err);
		}

		var raw_event = {
			workflow: req.body.workflow,
			client_search_term: req.body.search_term,
			client_referrer: req.body.referrer_url,
			ip: req.connection.remoteAddress,
			ua: req.headers['user-agent'],
			cookie: req.headers.cookie,
			server_referrer: req.headers.referer,
			express_route_url: req.url,
			timestamp: req._startTime,
			geo: superagent_res.body,
		};

		var url = 'localhost:' + es_port + '/rawevents/alpha'
		superagent
			.post(url)
			.send(raw_event)
			.end(function(err, agent_res) {
				if (err) {
					console.log(err);
					res.send(400);
				}
				res.send(200);
			}) // end of inner superagent call
		}) // end of outer superagent call
});

app.get('/prefixQuery/:index/:prefix', function(req, res) {
	var index = req.param('index');
	var prefix = req.param('prefix');
	prefixQuery(index, prefix, function(es_response) {
		var sources = simplifyResults(es_response);
		var interactive_sources = _.map(sources, function(source) {
			if (_.has(source, 'dropoff_instructions')) {
				source['actions'] = ['find locations'];
			}
			return source;
		}) 
		res.send(interactive_sources);
	});
});
