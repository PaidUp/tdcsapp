var login = require('../auth/authParent.spec');
var model = require('../../../e2e/models').creditCardDetails;
var account = require('../account/account.helper.spec');
var accountUpdate = require('../account/update.account.spec');
var athlete = require('../../athletes/add.athlete.spec');
var model = require('../../../e2e/models').athlete;
var addPaymentMethod = require('./payment.spec');

module.exports = {
  before : function(browser) {
    login.authParentOpenModal(browser);
    login.fillFormRegisterParent(browser);
    login.validateUserLogged(browser);
    athlete.openModal(browser);
    athlete.fillFormNewAthlete(browser);
    athlete.validateNewAthlete(browser);
    account.userAccount(browser);
    accountUpdate.updateProfileAccount(browser);
    accountUpdate.updateContactInfoAccount(browser);
    accountUpdate.submitForm(browser);
    addPaymentMethod.userPayments(browser);
    addPaymentMethod.userCardCreate(browser);
    addPaymentMethod.fillFormCardCreate(browser);
    addPaymentMethod.validateCardAdd(browser);
    account.redirectAthletePage(browser);
  },

  after : function(browser) {
    login.logout(browser);
  },
  'selectAthelete' : function (browser) {
    browser
      .waitForElementVisible('body', 1000)
      .click('#'+model.firstName)
  },
  'selectTeam' : function (browser) {
    browser
      .waitForElementVisible('list-teams div .thumbnail', 5000)
      .getValue('list-teams div .thumbnail:last-child', function(result){
        browser.click('list-teams div .thumbnail:last-child')
      })
      .pause(5000)
  },
  'selectSubTeam' : function (browser) {
    browser
      .waitForElementVisible('#selectTeam', 15000)
      .setValue('#selectTeam','North Texas Banditos - 14U White')
      .setValue('#selectTeam', browser.Keys.TAB)
  },
  'selectPaymentPlan' : function (browser) {
    browser
      .waitForElementVisible('#select0', 5000)
      .setValue('#select0', 'Payment In Full ($866.25)')
      .setValue('#select0', browser.Keys.TAB)
      .pause(10000)
  },
  'submitButtonPayNow' : function (browser) {
    browser
      .click('button[type=submit]')
  },
  'submitButtonProccedToCheckout' : function (browser) {
    browser
      .pause(15000)
      .setValue('#proceed-to-checkout', browser.Keys.TAB)
      .click('#proceed-to-checkout')
  },
  'selectPaymentMethod' : function (browser) {//TODO
  browser
    .pause(15000)
    .setValue('input[name=phone]', browser.Keys.TAB)
    .waitForElementVisible('#lstSelectAccount', 10000)
    .setValue('#lstSelectAccount', 'Visa ending in 1111')
    .setValue('#lstSelectAccount', browser.Keys.TAB)
  },
  'submitButton' : function (browser) {//TODO
    browser
      .click('button[type=submit]')
      .pause(25000)
  },
  'verifyCheckout' : function (browser) {//TODO
  browser.assert.urlEquals('http://localhost:9000/commerce/checkout/success/card')
  }
};