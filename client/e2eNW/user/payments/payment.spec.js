var login = require('../auth/auth.spec');
var model = require('../../../e2e/models').creditCardDetails;

module.exports = {
  before : function(browser) {
    login.authParentOpenModal(browser);
    login.fillFormRegisterParent(browser);
    login.validateUserLogged(browser);
  },

  after : function(browser) {
    login.logout(browser);
  },

  'userAccount' : function (browser) {
    
    browser
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('a[aria-haspopup=true]', 1000)
      .click('a[aria-haspopup=true]')
      .pause(2000)
      .waitForElementVisible('#profile', 1000)
      .click('#profile')
      .pause(1000)
      .url(function(url){
        this.assert.equal(url.value,'http://localhost:9000/user/account')
      })
      .pause(1000)
  },
  'userPayments' : function (browser) {
    browser
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('li[ui-sref=user-payments]', 1000)
      .click('li[ui-sref=user-payments]')
      .pause(1000)
      .url(function(url){
        this.assert.equal(url.value,'http://localhost:9000/user/payments')
      })
  },
  'userCardCreate' : function (browser) {
    browser
      .waitForElementVisible('#hrefAddNewCard', 1000)
      .click('#hrefAddNewCard')
      .pause(1000)
      .url(function(url){
        this.assert.equal(url.value,'http://localhost:9000/user/card/create')
      })
      .pause(1000)
  },
  'fillFormCardCreate' : function (browser) {
    browser
      .setValue('input[name=nameOnCard]',model.card.nameOnCard)
      .setValue('input[name=cardNumber]',model.card.cardNumber)
      .setValue('#month',model.card.expirationDate.month)
      .setValue('#year',model.card.expirationDate.year)
      .setValue('input[name=securityCode]',model.card.securityCode)
      .setValue('input[name=zipCode]',model.card.zipCode)
      .pause(1000)
      /*.getValue('input[name=name]',function(result){
        this.assert.equal(result.value,model.firstname)
      })*/
  },
  'validateCardAdd' : function (browser) {//class="btn btnSignUp btn-block btn-lg"
    browser
      .waitForElementVisible('button[type=submit]', 1000)
      .click('button[type=submit]')
      .pause(5000)
      .url(function(url){
        this.assert.equal(url.value,'http://localhost:9000/user/payments')
      })
      //TODO validate radio button exists. and value is true.
      //.waitForElementVisible('input[name=primaryCard]', 5000)
      //.assert.visible("input[name=primaryCard]")
      .pause(1000)
  }
};