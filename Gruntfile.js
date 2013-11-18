'use strict';
//TODO set up code coverage output
module.exports = function(grunt) {
  
  require('load-grunt-tasks')(grunt);
  
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'lib*',
        'test*',
      ]
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/*.js']
      }
    },
    symlink: {
      wampumfrontend: {
        dest: 'static/ui/wampumfrontend/app',
        relativeSrc: '../../../../wampumfrontend/app',
        options: {type: 'dir'}
      }
    }
  });

  grunt.registerTask('default', [
    'mochaTest',
  ]);
};