var express = require('express'),
	settings = require('config'),
	_ = require('lodash'),
	superagent = require('superagent');


exports = module.exports;
var app = exports.app = express();
var env = process.env.NODE_ENV || 'development';

var logger = require('bucker').createLogger(settings.logger_opts, module);

app.set('elasticsearch_port', settings.elasticsearch_port);


var es_port = app.get('elasticsearch_port');
var base = 'http://localhost:' + es_port;


var simplifyResults = function(obj) {
	var hits_array = obj.hits.hits;
	return _.pluck(hits_array, '_source');
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
			logger.tags(['term']).info(prefix);
			return callback(null, res.body);
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
			var unique_tags = autoCompleteHelper(hits_array);
			res.send(unique_tags);
		});
});

app.get('/prefixQuery/:index/:prefix', function(req, res) {
	var index = req.param('index');
	var prefix = req.param('prefix');
	prefixQuery(index, prefix, function(err, es_response) {
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
