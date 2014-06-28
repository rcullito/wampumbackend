var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  shell = require('gulp-shell');


gulp.task('server', function () {
  nodemon({
    script: 'app.js',
    ext: 'html js',
    env: { 'NODE_ENV': 'dev' }
  })
  .on('restart', function () {
    console.log('express server restarted');
  });
});

gulp.task('default', ['server']);


// old grunt symlink configuration
// symlink: {
//   wampumfrontend: {
//     dest: 'static/ui/wampumfrontend/dist',
//     relativeSrc: '../../../../wampumfrontend/dist',
//     options: {type: 'dir'}
//   }
// }