var login = require('../user/auth/authParent.spec');
var model = require('../../e2e/models').athlete;

module.exports = {
  before : function(browser) {
    login.authParentOpenModal(browser);
    login.fillFormRegisterParent(browser);
    login.validateUserLogged(browser);
  },

  after : function(browser) {
    login.logout(browser);
  },

  'openModal' : function (browser) {
    browser
      .waitForElementVisible('body', 1000)
      .click('#add-athlete-btn')
      .pause(1000)
  },

  'fillFormNewAthlete' : function (browser) {
    browser
      .waitForElementVisible('body', 1000)
      .setValue('input[name=firstName]',model.firstName)
      .setValue('input[name=lastName]',model.lastName)
      .click('input[name=radioGender]')
      .setValue('input[name=month]',model.date.month)
      .setValue('input[name=day]',model.date.day)
      .setValue('input[name=year]',model.date.year)
      .pause(1000)
  },

  'validateNewAthlete' : function (browser) {
    
    browser
      .click('button[type=submit]')
      .pause(5000)
      .waitForElementVisible('.img-circle', 1000)
      //HERE TODO validate with athlete was create.
      .url(function(url){
        this.assert.equal(url.value,'http://localhost:9000/athletes/dashboard')
      })
      .pause(5000)
  }
};