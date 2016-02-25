var login = require('../auth/authParent.spec');
var model = require('../../../e2e/models').creditCardDetails;
var account = require('../account/account.helper.spec');
var accountUpdate = require('../account/update.account.spec');
var athlete = require('../../athletes/add.athlete.spec');
var model = require('../../../e2e/models').athlete;

module.exports = {
  before : function(browser) {
    login.authParentOpenModal(browser);
    login.fillFormRegisterParent(browser);
    login.validateUserLogged(browser);
    athlete.openModal(browser);
    athlete.fillFormNewAthlete(browser);
    athlete.validateNewAthlete(browser);
    //account.userAccount(browser);
    //accountUpdate.updateProfileAccount(browser);
    //accountUpdate.updateContactInfoAccount(browser);
    //accountUpdate.submitForm(browser);
    //account.redirectAthletePage(browser);
    //TODO add credit card
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
        console.log('result', result)
        browser.click('list-teams div .thumbnail:last-child')
      })
      .pause(5000)
  },
  'selectSubTeam' : function (browser) {
    browser
      .waitForElementVisible('#selectTeam', 15000)
      .setValue('#selectTeam','North Texas Banditos - 14U White')
      .setValue('#selectTeam', browser.Keys.TAB)
      //.click('option[value=object:282]')
  },
  'selectPaymentPlan' : function (browser) {
    browser
      .waitForElementVisible('#select0', 5000)
      .setValue('#select0', 'Payment In Full ($866.25)')
      .setValue('#select0', browser.Keys.TAB)
      //.click('option[value=30]')
      .pause(5000)
  },
  'submitButtonPayNow' : function (browser) {
    browser
      .click('button[type=submit]')
  },
  'submitButtonProccedToCheckout' : function (browser) {
    browser
      .pause(15000)
      .click('#proceed-to-checkout')
  },
  'selectPaymentMethod' : function (browser) {

  },
  'selectPaymentMethod' : function (browser) {
  //browser
    //.pause(15000)
    //.click('#proceed-to-checkout')
  }
};