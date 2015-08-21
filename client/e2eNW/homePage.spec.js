module.exports = {
  'Home page CS' : function (browser) {
    browser
      .url('http://localhost:9000')
      .waitForElementVisible('body', 1000)
      /*.getValue('button[name=CSGetStarted]', function(result){
        console.log('result',result);
      })*/
      .getText('button[name=CSGetStarted]', function(result){
        this.assert.equal(result.value, 'Get Started Free!');
      })
      //.waitForElementVisible('button[name=btnG]', 1000)
      //.click('button[name=CSGetStarted]')
      .pause(1000)
      .assert.containsText('.titleBannerHome', 'Stop chasing payments and get your time back!')
      //.assert.containsText('.btn btnSignUp btn-block btn-lg', 'Get Started Free')
      .end();
  }
};