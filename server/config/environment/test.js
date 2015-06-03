'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/convenience-test'
  },
  emailContacts : {
    contact : 'convenieceselect@gmail.com',
    admin : 'convenieceselect@gmail.com',
    developer : 'convenieceselect@gmail.com'
  },
  emailService:{
    service: 'Gmail',
    auth: {
      user: '',
      pass: ''
    }
  }
};
