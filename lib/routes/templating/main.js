var jade = require('jade'),
    express = require('express'),
    async = require('async'),
    moment = require('moment'),
    _ = require('lodash'),
    fs = require('fs');

exports = module.exports;

var app = exports.app = express();
var route_express = 'lib/routes/templating/blogs/';

var written_blog_title_to_readable = function (written) {
  var split_title =  written.split('_');
  var title = _.first(split_title, (split_title.length - 1));
  var date = _.last(split_title).split(".").join("/");
  return {
    title: title.join(" "),
    date: moment(date).format('YYYY-MM-DD')
  };
};

var getTitles = function (callback) {
  fs.readdir('lib/routes/templating/blogs', function(err, blog_titles){
    var blog_titles_split = _.chain(blog_titles)
      .map(function (blog_title){
        return written_blog_title_to_readable(blog_title);
      })
      .sortBy('date')
      .reverse()
      .each(function (blog_title) {
        blog_title.date = moment(blog_title.date).format('MMMM YYYY');
      })
      .value();
    callback(null, blog_titles_split);
  });
};

var getTitle = function (title, callback) {
  fs.readFile(route_express + title, 'utf8', function (err, content) {
    var jadeTemplate = content;
    var fn = jade.compile(jadeTemplate);
    var htmlOutput = fn({});
    callback(null, htmlOutput);
  });
};

app.get('/blogList', function (req, res) {
  getTitles(function (err, titles) {
    res.send(titles);
  });
});

app.get('/getTitle/:title', function (req, res) {
  getTitle(req.param('title'), function (err, content) {
    res.send(content);
  })
});