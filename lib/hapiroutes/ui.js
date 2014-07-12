var Hapi = require("hapi"),
  path = require('path');

var WAMPUM_INDEX_FILE = path.join(__dirname, '..', '..', 'static', 'index.html');
// for rationale behind sending index file, please see http://docs.angularjs.org/guide/dev_guide.services.$location

exports.routes = [
  {
    path: "/",
    method: "GET",
    handler: function (request, reply) {
      reply.file(WAMPUM_INDEX_FILE);
    }
  },
  {
    path: "/itemlist",
    method: "GET",
    handler: function (request, reply) {
      reply.file(WAMPUM_INDEX_FILE);
    }
  },
  {
    path: "/ship/{param*}",
    method: "GET",
    handler: function (request, reply) {
      reply.file(WAMPUM_INDEX_FILE);
    }
  },
  {
    path: "/static/{path*}",
    method: "GET",
    handler: {
      directory: {
        path: "./static",
        listing: false,
        index: true
      }
    }
  }  
];