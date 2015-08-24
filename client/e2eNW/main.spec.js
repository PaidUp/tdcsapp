module.exports = {
  'Home page CS' : function (browser) {
    browser
      .url('http://localhost:9000')
      .waitForElementVisible('body', 1000)
      .getText('button[name=CSGetStarted]', function(result){
        this.assert.equal(result.value, 'Get Started Free!');
      })
      .pause(1000)
      .assert.containsText('.titleBannerHome', 'Stop chasing payments and get your time back!')
      .end();
  }
};