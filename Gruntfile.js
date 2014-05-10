'use strict';
//TODO set up code coverage output
module.exports = function(grunt) {
  
  require('load-grunt-tasks')(grunt);
  
  grunt.initConfig({
    express: {
      options: {
        port: process.env.PORT || 3000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost'
      },
      livereload: {
        options: {
          script: 'app.js',
        }
      },
    },
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
    watch: {
      options: {
        livereload: true,
        nospawn: true, // without this option specified express won't be reloaded
      },
      livereload: {
        files: [
          'app.js',
          'lib/**/*.{js,json}',
          'static*',
        ],
        tasks: ['express:livereload'],
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/*.js']
      }
    },
    parallel: {
      tunnels: {
        tasks: [
          { cmd: 'ssh', args: ['-i', '/Users/robertculliton/acton.pem', '-N', '-L', '9300:localhost:9200', 'ubuntu@54.204.7.85']},
          { cmd: 'ssh', args: ['-i', '/Users/robertculliton/acton.pem', '-N', '-L', '1234:localhost:1234', 'ubuntu@54.204.7.85']},
        ]
      },
    },
    shell: {
      killTunnels: {
        command: 'ps -ef | grep "ssh -i /Users/robertculliton/acton.pem -N -L" | grep -v "grep" | awk \'{print $2}\' | xargs kill -9'
      }
    },
    symlink: {
      wampumfrontend: {
        dest: 'static/ui/wampumfrontend/dist',
        relativeSrc: '../../../../wampumfrontend/dist',
        options: {type: 'dir'}
      }
    }
  });

  grunt.registerTask('default', [
    'mochaTest',
  ]);

  grunt.registerTask('server', [
    'express:livereload',
    'watch'
  ]);

};