var Hapi = require("hapi"),
  Joi = require("joi"),
  settings = require('config'),
  _ = require('lodash'),
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

var searchConfig = {
  handler: function (request, reply) {
    var searchterm = request.params.searchterm;
    fuzzyQuery(searchterm, function(err, es_response) {
        if (err) {
            console.log(err);
            return reply([]);
        }
        var sources = simplifyResults(es_response);
        var interactive_sources = _.map(sources, function(source) {
            if (_.has(source, 'dropoff_instructions')) {
                source['actions'] = ['find locations'];
            }
            return source;
        });
        reply(interactive_sources);
    });
  }
};

var route = {
  path: "/search/{searchterm}",
  method: "GET",
  config: searchConfig,
}

exports.route = route;