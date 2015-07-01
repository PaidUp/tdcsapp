'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/convenience-test',
    options: {
      db: {
        safe: false
      },
      prefix:'TDcsApp_'
    }
  },
  emailContacts : {
    contact : 'convenieceselect@gmail.com',
    admin : 'convenieceselect@gmail.com',
    developer : 'convenieceselect@gmail.com'
  },
  emailService:{
    service: 'Gmail',
    auth: {
      user: 'xxx',
      pass: 'xxx'
    }
  },
  emailVars: {
    companyName : "Convenience Select (testCsApp)",
    baseUrl : "https://develop.convenienceselect.com"
  },
  stripe:{
    apiPublic: "pk_test_J5gfockQi2DP28GszFZvTnwS"
  }
};
