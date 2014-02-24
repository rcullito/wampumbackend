var jade = require('jade');
var fs = require('fs');


fs.readFile('./blog4', 'utf8', function (err, data) {
  if (err) throw err;

    var jadeTemplate = data;
    var fn = jade.compile(jadeTemplate);
    var htmlOutput = fn({
      // maintainer: {
      //   name: 'Forbes Lindesay',
      //   twitter: '@ForbesLindesay',
      //   blog: 'forbeslindesay.co.uk'
      // }
    });

    console.log(htmlOutput);



});



