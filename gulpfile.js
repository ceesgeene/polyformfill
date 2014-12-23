'use strict';

var gulp = require('gulp'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  replace = require('gulp-replace'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify');

gulp.task('default', function () {
  // place code for your default task here
});

gulp.task('compress', function () {
  gulp.src(['src/polyformfill.js.prefix', 'src/**/base.js', 'src/**/*.js', 'src/polyformfill.js.suffix'])
    .pipe(concat('polyformfill.js'))
    .pipe(replace("'use strict';", ''))
    .pipe(uglify({
      mangle: false,
      output: {
        indent_level: 2,
        beautify: true,
        bracketize: true,
        semicolons: false,
        width: 120
      },
      compress: false,
      preserveComments: 'some'
    }))
    .pipe(gulp.dest('./'))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename('polyformfill.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'));
});
