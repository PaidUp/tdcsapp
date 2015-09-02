var model = require('../../../e2e/models').signup;

module.exports = {
  'authCoachOpenModal' : function (browser) {
    browser
      .url('http://localhost:9000')
      .waitForElementVisible('body', 1000)
      .click('#signup')   
      .waitForElementVisible('#sign-up-email', 1000)
      .click('#sign-up-email')
      .waitForElementVisible('#IamCoach', 1000)
      .click('#IamCoach')
  },
  'fillFormRegisterCoach' : function (browser) {
    browser
      .setValue('input[name=name]',model.firstname)
      .setValue('input[name=lastName]',model.lastname)
      //.setValue('input[name=email]',model.fakeEmail)
      .setValue('input[name=email]','email'+Math.random()+'@gmail.com')
      .setValue('input[name=password]',model.pass)
      .setValue('input[name=confirm]',model.pass)
      //.setValue('input[ng-model=user.signupRememberMe]','123456')
      .getValue('input[name=name]',function(result){
        this.assert.equal(result.value,model.firstname)
      })
  },
  'validateCoachLogged' : function (browser) {
    browser
      .waitForElementVisible('#submit-email-login', 1000)
      .click('#submit-email-login')
      .pause(10000)
      .url(function(url){
        this.assert.equal(url.value,'http://localhost:9000/commerce/provider/request')
      })
      .pause(2000)
      .waitForElementVisible('div[animate=animate]', 1000)
      .click('div[animate=animate]')
      .pause(1000)
  },
  'logoutCoach' : function (browser){
    browser
      .waitForElementVisible('a[aria-haspopup=true]', 1000)
      .click('a[aria-haspopup=true]')
      .pause(1000)
      .click('#signout')
      .pause(2000)
      .url(function(url){
        this.assert.equal(url.value,'http://localhost:9000/')
      })
      .pause(1000)
      .end();
  }
};