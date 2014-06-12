var express = require('express'),
	settings = require('config'),
	_ = require('lodash'),
	elasticsearch = require('elasticsearch');


exports = module.exports;
var app = exports.app = express();
var env = process.env.NODE_ENV || 'development';

var logger = require('../../modified/bucker').createLogger(settings.logger_opts, module);

var esClient = new elasticsearch.Client({
  host: settings.elasticsearch.host + ':' + settings.elasticsearch.port,
});


var simplifyResults = function(obj) {
	var hits_array = obj.hits.hits;
	var max_score = obj.hits.max_score;

	var color_brewer = ['#081d58', '#253494', '#225ea8', '#1d91c0', '#41b6c4', '#7fcdbb', '#c7e9b4', '#edf8b1', '#ffffd9'];

	var extended_hits_array = _.map(hits_array, function (hit, index) {
		var wampum_score = hit._score / max_score;
		var wampum_color = color_brewer[index];
		hit._source.wampum_score = wampum_score;
		hit._source.wampum_color = wampum_color;
		return hit;
	});

	return _.pluck(extended_hits_array, '_source');
};

var autoCompleteHelper = function (hits_array) {
	var unique_tags = _.chain(hits_array)
		.map(function(hit) {
			var tags_array = _.first(hit.fields.tags);
			return  tags_array.split(", ");
		})
		.flatten()
		.uniq()
		.map(function (tag) {
			return { tag: tag };
		})
		.value();

	return unique_tags;
};


var fuzzyQuery = function(search_term, callback) {

	esClient.search({
	  index: 'stuff',
	  type: 'clothing',
	  size: settings.elasticsearch.size,
	  body: {
		    query: {
		        bool: {
		            should: [
		                {
		                    match: {
		                        tags: search_term
		                    }
		                },
		                {
		                    match: {
		                        tags: {
		                            query: search_term,
		                            fuzziness: "1",
		                            prefix_length: 2
		                        }
		                    }
		                }
		            ]
		        }
		    }
		}

	}).then(function (resp) {
	    return callback(null, resp);
	}, function (err) {
	    return callback(err);
	});
};

app.get('/autocomplete', function (req, res) {
	esClient.search({
	  index: 'stuff',
	  type: 'clothing',
	  size: settings.elasticsearch.size,
	  body: {
      fields: ["tags"]
		}
	}).then(function (resp) {
			var unique_tags = autoCompleteHelper(resp.hits.hits);
			res.send(unique_tags);
	}, function (err) {
	    return console.log(err);
	});
});


app.post('/clickevent', function (req, res) {
	var event_type = req.param('event_type');
	var event_value = req.param('event_value');
	var requestid = req.param('requestid');

	if (requestid) {
		logger.tags([ event_type ]).info('dest=' + event_value + ' ' + 'requestid=' + requestid);
	} else {
		logger.tags([ event_type ]).info('dest=' + event_value);
	}
	
	res.send(200);
});

app.get('/ping', function (req, res) {
	res.send(200, 'pong');
});


// have this be the main search function and then sub in other changes here

app.get('/search/:searchterm', function(req, res) {
	var searchterm = req.param('searchterm');
	fuzzyQuery(searchterm, function(err, es_response) {
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
