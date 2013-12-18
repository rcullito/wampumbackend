var express = require('express'),
	_ = require('lodash'),
	superagent = require('superagent');


exports = module.exports;
var app = exports.app = express();

var es_port = app.get('elasticsearch_port') || 9300;

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

var getTypes = function(index, callback) {
	var url = [base, index, '_mapping'].join('/');
	superagent
		.get(url)
		.end(function(err, res) {
			if (err) {
				return callback(errorHelper(err));
			}
			var current_index = res.body[index];
			var types = _.keys(current_index);
			return callback(types);
		});
};

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
			return callback(errorHelper(err));
		}
		callback(res.body);
	});
};

var prefixQuery = function(index, user_prefix_term, callback) {

	var url = [base, index, '_search'].join('/');

	var query = 
	{
		"query": {
			"prefix": {"_all": user_prefix_term}
		}
	};
	superagent
		.get(url)
		.send(query)
		.end(function(err, res) {
			if (err) {
				console.log(err);
				return;
			}
			return callback(res.body);
		})
};
exports.prefixQuery = prefixQuery;

app.get('/getTypes/:index', function(req, res) {
	var index = req.param('index');
	getTypes(index, function(es_response) {
		res.send(es_response);
	});
});

app.get('/searchAll/:index/:type?', function(req, res) {
	var index = req.param('index');
	var type = req.param('type');
	searchAll(index, type, function(es_response) {
		res.send(simplifyResults(es_response));
	});
});

// collect raw events one up front and then once on search
app.post('/eventcollector', function(req, res) {
	// TODO add geolocation lookup to these

	// superagent
	// 	.get('freegeoip.net/json/' + req.connection.remoteAddress)
	// 	.end(function(err, superagent_res) {
	// 		console.log(superagent_res);
	// 	})


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
	};
	if (raw_event) {
		var url = 'localhost:' + es_port + '/rawevents/alpha'
		superagent
			.post(url)
			.send(raw_event)
			.end(function(err, agent_res) {
				if (err) {
					console.log(err);
					res.send(400);
				}
				console.log(agent_res.body);
				res.send(200);
			})
	} else {
		res.send(400);
	}
});


app.get('/prefixQuery/:index/:prefix', function(req, res) {
	var index = req.param('index');
	var prefix = req.param('prefix');
	console.log(prefix);
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
