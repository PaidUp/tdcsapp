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

  'preValidateForm': function (browser) {
    browser.getText(".dropdown-toggle", function(result) {
      this.assert.equal(result.value, "Zuly Alcaraz");
    });
  },
  'updateProfileAccount' : function (browser) {
    browser
      .clearValue('input[name=firstName]')
      .setValue('input[name=firstName]', 'change name')
      .clearValue('input[name=lastName]')
      .setValue('input[name=lastName]', 'change last')
      .pause(1000)
  },
  'updatePasswordAccount' : function (browser) {
    browser
      .setValue('input[name=password]', 'newPassword')
      .setValue('input[name=confirm]', 'newPassword')
  },

  'updateContactInfoAccount' : function (browser) {
    browser
      .clearValue('input[name=phone]')
      .setValue('input[name=phone]', '9877899871')
      .setValue('input[name=address1]', 'new street')
      .setValue('input[name=address2]', 'avenue')
      .setValue('input[name=city]', 'Austin')
      .setValue('#state', 'TX')
      .setValue('input[name=zipCode]', '00000')
      .setValue('#chksameBillingAsShiping', browser.Keys.TAB)
      .setValue('#chksameBillingAsShiping', browser.Keys.SPACE)
      .pause(2000)
  },
  'submitForm' : function (browser) {
    browser
      .setValue('#btnSaveAccount', browser.Keys.ENTER)
      .pause(4000)
  },
  'validateChangesAccount' : function (browser) {
    browser.assert.value("input[name=firstName]", "change name");
    browser.getText(".dropdown-toggle", function(result) {
      this.assert.equal(result.value, "change name change last");
    });
  }
};