var express = require('express'),
	settings = require('config'),
	_ = require('lodash'),
	esutil = require('../esutil');


exports = module.exports;
var app = exports.app = express();

var logger = require('../../modified/bucker').createLogger(settings.logger_opts, module);


var simplifyResults = function(obj) {
	var hits_array = obj.hits.hits;
	var max_score = obj.hits.max_score;
	var color_brewer = ['#081d58', '#253494', '#225ea8', '#1d91c0', '#41b6c4', '#7fcdbb', '#c7e9b4', '#edf8b1', '#ffffd9'];

	var extended_hits_array = _.map(hits_array, function (hit, index) {
        var last_part_of_address = _.last(hit._source.mailingaddress.split('|'));
        var array_of_macro_geo = last_part_of_address.split(' ');
        var zip = _.last(array_of_macro_geo);
        hit._source.mailingaddress = _.pull(array_of_macro_geo, zip).join(' ');
		var wampum_score = hit._score / max_score;
		var wampum_color = color_brewer[index];
		hit._source.wampum_score = wampum_score;
		hit._source.wampum_color = wampum_color;
		hit._source.id = hit._id;
		return hit;
	});

	return _.pluck(extended_hits_array, '_source');
};


var fuzzyQuery = function(search_term, callback) {


    var searchQueryBody = {
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
    };

    esutil.search('stuff', 'clothing', searchQueryBody, function (err, res) {
        if (err) {
            return callback(err);
        }
        return callback(null, res);
    })

};


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
