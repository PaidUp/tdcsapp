var login = require('../auth/auth.spec');

module.exports = {
  'userAccount' : function (browser) {
    login.authParentOpenModal(browser);
    login.fillForm(browser);
    login.validateUserLogged(browser);
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
      // TODO: I am here
      .waitForElementVisible('li[heading=Payment Methods]', 1000)
      .click('li[heading=Payment Methods]')
      .pause(1000)
      .url(function(url){
        this.assert.equal(url.value,'http://localhost:9000/user/payments')
      })
      .end();
  }
};