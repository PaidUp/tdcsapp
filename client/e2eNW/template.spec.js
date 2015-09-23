var login = require('./user/auth/authParent.spec.js');

module.exports = {
  before : function(browser) {
    login.authParentOpenModal(browser);
    login.fillFormRegisterParent(browser);
    login.validateUserLogged(browser);
  },

  after : function(browser) {
    login.logout(browser);
  },

  'template' : function (browser) {
    
    browser
      .waitForElementVisible('body', 1000)
      //Copy this file, and you can start to create testing e2e.  happy hacking =)
      .pause(1000)
  }
};