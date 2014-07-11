var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  shell = require('gulp-shell');


gulp.task('server', function () {
  nodemon({
    script: 'index.js',
    ext: 'html js',
    // env: { 'NODE_ENV': 'dev' }
  })
  .on('restart', function () {
    console.log('server restarted');
  });
});

gulp.task('build', function () {
  return gulp.src(['./*', '!./node_modules/**', '!./node_modules/'])
    .pipe(gulp.dest('../build'));
});
