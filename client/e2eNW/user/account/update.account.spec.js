var login = require('../auth/authParent.spec');
var model = require('../../../e2e/models').creditCardDetails;
var account = require('./account.helper.spec');

module.exports = {
  before : function(browser) {
    login.authParentOpenModal(browser);
    login.fillFormRegisterParent(browser);
    login.validateUserLogged(browser);
    account.userAccount(browser);
  },

  after : function(browser) {
    login.logout(browser);
  },

  'updateProfile' : function (browser) {
    //verify fullname before update profile
    //update first and last name
    //verify fullname before update profile
    browser
      //.waitForElementVisible('#btnCreateCard', 1000)
      //.setValue('#btnCreateCard', browser.Keys.ENTER)
      //.pause(20000)
      //.url(function(url){
        //this.assert.equal(url.value,'http://localhost:9000/user/payments')
      //})
      .pause(1000)
  }
};