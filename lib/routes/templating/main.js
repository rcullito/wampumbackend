var jade = require('jade'),
    express = require('express'),
    async = require('async'),
    moment = require('moment'),
    _ = require('lodash'),
    fs = require('fs');

exports = module.exports;

var app = exports.app = express();

var getTitles = function (callback) {
  fs.readdir('lib/routes/templating/blogs', function(err, blog_titles){
    var blog_titles_split = _.chain(blog_titles)
      .map(function (blog_title){
        var split_title =  blog_title.split('_');
        var title = _.first(split_title, (split_title.length - 1));
        var date = _.last(split_title).split(".").join("/");
        return {
          title: title.join(" "),
          date: moment(date).format('YYYY-MM-DD'),
        };
      })
      .sortBy('date')
      .reverse()
      .value();
    callback(null, blog_titles_split);
  });
};

app.get('/blogList', function (req, res) {
  getTitles(function (err, titles) {
    res.send(titles);
  });
});


// verizon-291
// 11eb8951








// make one api for the titles, which will be any line that starts with an h3 tag

// make another api for the actual html rendered blogs


// fs.readFile('./blog4', 'utf8', function (err, data) {
//   if (err) throw err;

//     var jadeTemplate = data;
//     var fn = jade.compile(jadeTemplate);
//     var htmlOutput = fn({
//       // maintainer: {
//       //   name: 'Forbes Lindesay',
//       //   twitter: '@ForbesLindesay',
//       //   blog: 'forbeslindesay.co.uk'
//       // }
//     });

//     console.log(htmlOutput);


// });




