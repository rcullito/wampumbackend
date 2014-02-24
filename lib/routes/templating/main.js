var jade = require('jade'),
    express = require('express'),
    async = require('async'),
    _ = require('lodash'),
    fs = require('fs');

exports = module.exports;

var app = exports.app = express();

var read_directory = function (callback) {
    fs.readdir('./blogs', function(err, files){
        callback(err, files);
    });  
};

read_directory(function (err, files) {

    async.map(files, function (file, callback) {

        fs.readFile('./blogs/' + file, 'utf8', function (err, data) {
          if (err) throw err;
            var lines = data.split("\n"); 


            var titles = _.filter(lines, function (line) {
                var words = line.split(" ");
                return _.contains(words, 'h3');
            });

            console.log(titles);
            // now split these by whitespace and if it contains h3



            // console.log(lines);
            callback(null, data);
        });

    }, function (err, results) {

        // filter the results to only lines beginning with h3, // then split by date

        // console.log(results);

    });

});






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




