module.exports = {
  'Home page CS' : function (browser) {
    browser
      .url('http://localhost:9000')
      .waitForElementVisible('body', 1000)
      .getText('button[name=CSGetStarted]', function(result){
        this.assert.equal(result.value, 'Get Started');
      })
      .getText('button[name=CSContactUs]', function(result){
        this.assert.equal(result.value, 'Contact Us');
      })
      .getText('button[name=CSGetMoreInfo]', function(result){
        this.assert.equal(result.value, 'Get More Info');
      })
      .pause(1000)
      .assert.containsText('.titleBannerHome', 'We help coaches stop chasing payments.')
      .end();
  }
};