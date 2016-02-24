var login = require('../auth/authParent.spec');
var model = require('../../../e2e/models').creditCardDetails;

module.exports = {
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
  }
};