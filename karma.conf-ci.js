'use strict';

/* global module, require, process */

/**
 * @file
 * Karma configuration for Travis.
 */

var fs = require('fs');

module.exports = function(config) {

  // Use ENV vars on Travis and sauce.json locally to get credentials
  if (!process.env.SAUCE_USERNAME) {
    if (!fs.existsSync('sauce.json')) {
      console.log('Create a sauce.json with your credentials based on the sauce-sample.json file.');
      process.exit(1);
    } else {
      process.env.SAUCE_USERNAME = require('./sauce').username;
      process.env.SAUCE_ACCESS_KEY = require('./sauce').accessKey;
    }
  }

  // Browsers to run on Sauce Labs
  var customLaunchers = {
    sl_chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: '39',
      // Sweden uses ISO 8601 for date and time representation. And while chrome localizes date input elements using
      // the browser language this makes testing easier.
      chromeOptions: {
        args: ['--lang=sv-SE']
      },
      platform: 'Windows 7'
    },
    sl_firefox: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '33'
    },
    sl_ie_9: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '9'
    },
    sl_ie_10: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '10'
    },
    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '11'
    }
  };

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'test/helpers/*.js',
      'src/**/!(base).js',
      'src/*/base.js',
      'src/base.js',
      'test/**/*.js',

      {pattern: 'test/popup.html', watched: true, served: true, included: false}
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots', 'saucelabs', 'coverage', 'coveralls'],

    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },

    // web server port
    port: 9876,

    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    sauceLabs: {
      testName: 'polyformfill'
    },
    captureTimeout: 120000,
    customLaunchers: customLaunchers,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: Object.keys(customLaunchers),
    singleRun: true
  });
};
