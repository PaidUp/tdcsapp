'use strict';

exports.config = {
  directConnect: true,
  allScriptsTimeout: 110000,
  getPageTimeout: 110000,
  baseUrl: 'http://localhost:' + (process.env.PORT || '9000'),

  suites: {
    authPath: ['client/e2e/user/auth/authCoach.spec.js'],
    providerRequest: ['client/e2e/commerce/provider/provider.request.spec.js']
  },
  exclude: [],
  capabilities: {
    'browserName': 'chrome'
  },

  onPrepare: function(done) {
  },
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 110000,
    isVerbose: true,
    includeStackTrace: true
  }
};
