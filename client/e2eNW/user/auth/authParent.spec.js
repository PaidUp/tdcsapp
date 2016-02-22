var model = require('../../../e2e/models').signup;

module.exports = {
  'authParentOpenModal' : function (browser) {
    browser
      .url('http://localhost:9000')
      .waitForElementVisible('body', 1000)
      .click('#signup')   
      .waitForElementVisible('#sign-up-email', 1000)
      .click('#sign-up-email')
  },
  'fillFormRegisterParent' : function (browser) {
    browser
      .setValue('input[name=inputName]',model.firstname)
      .setValue('input[name=lastName]',model.lastname)
      .setValue('input[name=inputEmail]','email'+Math.random()+'@gmail.com')
      .setValue('input[name=password]',model.pass)
      .setValue('input[name=confirm]',model.pass)
      .pause(5000)
      .getValue('input[name=inputName]',function(result){
        this.assert.equal(result.value,model.firstname)
      })
      .pause(5000)
  },
  'validateUserLogged' : function (browser) {
    browser
      .waitForElementVisible('#submit-email-login', 1000)
      .click('#submit-email-login')
      .pause(10000)
      .url(function(url){
        this.assert.equal(url.value,'http://localhost:9000/athletes/dashboard')
      })
      .pause(2000)
  },
  'logout' : function (browser){
    browser
      .waitForElementVisible('a[aria-haspopup=true]', 1000)
      .click('a[aria-haspopup=true]')
      .pause(1000)
      .click('#signout')
      .pause(5000)
      .url(function(url){
        this.assert.equal(url.value,'http://localhost:9000/')
      })
      .pause(1000)
      .end();
  }
};