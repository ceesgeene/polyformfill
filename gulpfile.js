var gulp = require('gulp');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

gulp.task('default', function () {
  // place code for your default task here
});

gulp.task('compress', function () {
  gulp.src('polyfill-input-datetime.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename('polyfill-input-datetime.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'))
});
