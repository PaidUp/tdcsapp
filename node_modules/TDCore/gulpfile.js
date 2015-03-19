var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('default', function () {
  return gulp.src('./core/test/*.spec.js', {
    read: false
  })
    .pipe(mocha({
      reporter: 'landing'
    }));
});