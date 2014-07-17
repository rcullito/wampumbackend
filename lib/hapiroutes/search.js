var Hapi = require("hapi"),
  Joi = require("joi"),
  settings = require('config'),
  _ = require('lodash'),
  server = require("../../"),
  esutil = require('../esutil');


var simplifyResults = function(obj) {
    var hits_array = obj.hits.hits;
    var max_score = obj.hits.max_score;
    var extended_hits_array = _.map(hits_array, function (hit, index) {
        var last_part_of_address = _.last(hit._source.mailingaddress.split('|'));
        var array_of_macro_geo = last_part_of_address.split(' ');
        var zip = _.last(array_of_macro_geo);
        hit._source.mailingaddress = _.pull(array_of_macro_geo, zip).join(' ');
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

var getSearch  = function (searchterm, next) {
  fuzzyQuery(searchterm, function(err, es_response) {
    server.log(["es"], "Fetching search term from elasticsearch");
    if (err) {
        console.log(err);
        next(null, []);
    }
    var sources = simplifyResults(es_response);
    var interactive_sources = _.map(sources, function(source) {
        if (_.has(source, 'dropoff_instructions')) {
            source['actions'] = ['find locations'];
        }
        return source;
    });
    next(null, interactive_sources);
  });
};

SECOND = 36000000;
server.method('getSearch', getSearch, {
  cache: {
    expiresIn: SECOND * 2
  }
});

var searchConfig = {
  handler: function (request, reply) {
    var searchterm = request.params.searchterm;
    request.log(["cavaliers"], JSON.stringify({
      tag: 'cavaliers',
      searchterm: searchterm,
      ua: request.headers['user-agent'],
    }));
    server.methods.getSearch(searchterm, function (error, result) {
      reply(error || result);
    });
  }
};

var route = {
  path: "/search/{searchterm}",
  method: "GET",
  config: searchConfig,
}

exports.route = route;
