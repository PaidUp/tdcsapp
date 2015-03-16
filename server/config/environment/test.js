'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/convenience-test'
  },
  emailContacts : {
    contact : 'hola@hola.com',
    admin : 'hola@hola.com',
    developer : 'hola@hola.com'
  },
  emailService:{
    service: 'Mailjet',
    auth: {
      user: '',
      pass: ''
    }
  }
};
