"use strict";

/* global require */

var gulp = require("gulp"),
  concat = require("gulp-concat"),
  preprocess = require("gulp-preprocess"),
  rename = require("gulp-rename"),
  replace = require("gulp-replace"),
  sourcemaps = require("gulp-sourcemaps"),
  uglify = require("gulp-uglify");

gulp.task("default", function () {
  // place code for your default task here
});

gulp.task("compress", function () {
  gulp.src(["src/polyformfill.js.prefix", "src/**/!(init).js", "src/init.js", "src/polyformfill.js.suffix"])
    .pipe(concat("polyformfill.js"))
    .pipe(replace('"use strict";', ""))
    .pipe(preprocess({
      context: {
        BROWSERS: {
          IE9: true
        },
        FEATURES: {
          DOM: true,
          VALIDATION: true,
          ACCESSIBILITY: true,
          LOCALIZATION: true,
          NORMALIZATION: true
        }
      }
    }))
    .pipe(uglify({
      mangle: false,
      output: {
        indent_level: 2,
        beautify: true,
        bracketize: true,
        semicolons: false,
        width: 120
      },
      compress: {
        sequences     : false,  // join consecutive statements with the “comma operator”
        properties    : false,  // optimize property access: a["foo"] → a.foo
        dead_code     : true,  // discard unreachable code
        drop_debugger : true,  // discard “debugger” statements
        unsafe        : false, // some unsafe optimizations (see below)
        conditionals  : false,  // optimize if-s and conditional expressions
        comparisons   : false,  // optimize comparisons
        evaluate      : false,  // evaluate constant expressions
        booleans      : false,  // optimize boolean expressions
        loops         : false,  // optimize loops
        unused        : true,  // drop unused variables/functions
        hoist_funs    : true,  // hoist function declarations
        hoist_vars    : true, // hoist variable declarations
        if_return     : false,  // optimize if-s followed by return/continue
        join_vars     : true,  // join var declarations
        cascade       : false,  // try to cascade `right` into `left` in sequences
        side_effects  : false,  // drop side-effect-free statements
        warnings      : true,  // warn about potentially dangerous optimizations/code
        global_defs   : {}     // global definitions
      },
      preserveComments: "some"
    }))
    .pipe(gulp.dest("./"))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename("polyformfill.min.js"))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./"));
});
