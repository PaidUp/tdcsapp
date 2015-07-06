// Protractor configuration
// https://github.com/angular/protractor/blob/master/referenceConf.js
// sudo npm install protractor -g
// sudo webdriver-manager update
'use strict';

exports.config = {
  directConnect: true,
  // The timeout for each script run on the browser. This should be longer
  // than the maximum time your application needs to stabilize between tasks.
  allScriptsTimeout: 110000,
  getPageTimeout: 110000,

  // A base URL for your application under test. Calls to protractor.get()
  // with relative paths will be prepended with this.
  baseUrl: 'http://localhost:' + (process.env.PORT || '9000'),

  // If true, only chromedriver will be started, not a standalone selenium.
  // Tests for browsers other than chrome will not run.
//  chromeOnly: true,

  suites: {
    //IMPORTANT
    //comment and uncomment specs. only authPath is necessary in all specs.
    authPath: ['client/e2e/user/auth/auth.spec.js'],
    //athlete: ['client/e2e/athletes/add-athlete.spec.js'],
    //updateAccount: ['client/e2e/user/account/account.update.spec.js'],
    addCreditCard: ['client/e2e/user/card/create.spec.js']
  },

  // Patterns to exclude.
  exclude: [],

  // ----- Capabilities to be passed to the webdriver instance ----
  //
  // For a full list of available capabilities, see
  // https://code.google.com/p/selenium/wiki/DesiredCapabilities
  // and
  // https://code.google.com/p/selenium/source/browse/javascript/webdriver/capabilities.js
  capabilities: {
    'browserName': 'chrome'
  },

  onPrepare: function(done) {
  },

  // ----- The test framework -----
  //
  // Jasmine and Cucumber are fully supported as a test and assertion framework.
  // Mocha has limited beta support. You will need to include your own
  // assertion framework if working with mocha.
  framework: 'jasmine',

  // ----- Options to be passed to minijasminenode -----
  //
  // See the full list at https://github.com/juliemr/minijasminenode
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 110000,
    isVerbose: true,
    includeStackTrace: true
  }
};
