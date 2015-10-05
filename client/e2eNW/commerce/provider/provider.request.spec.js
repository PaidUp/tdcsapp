var login = require('../../user/auth/authCoach.spec');
var model = require('../../../e2e/models').provider;
var modelCoach = require('../../../e2e/models').signup;

module.exports = {
  before : function(browser) {
    login.authCoachOpenModal(browser);
    login.fillFormRegisterCoach(browser);
    login.validateCoachLogged(browser);
  },

  after : function(browser) {
    login.logoutCoach(browser);
  },

  'validatePageProviderRequest' : function (browser) {
    browser
      .getValue('input[name=ownerFirstName]',function(result){
        this.assert.equal(result.value,"")
      })
      .getValue('input[name=ownerLastName]',function(result){
        this.assert.equal(result.value,"")
      })
      .getText('small[name=smallQuoteLegalName]',function(result){
        this.assert.equal(result.value,'Provide your name as it appears on legal documents to avoid money transfer delays.')
      })
      .getText('div[name=labelQuoteIdentifyVerification]',function(result){
        this.assert.equal(result.value,'We require someone from your organization to verify their identity. If your organization is a legal entity, like an LLC or Inc., choose a representative to input their info.')
      })
      .getText('div[name=labelQuoteOrganizationDisplayName]',function(result){
        this.assert.equal(result.value,'This is the name of your organization that will be displayed to users on our site (e.g. Austin Tigers). This may be different than the legal name (e.g. Tigers Baseball, LLC) which you will provide below.')
      })
      .getText('div[name=divQuoteFundsRecipient]',function(result){
        this.assert.equal(result.value,'Identify verification helps to ensure users that there is a real organization behind every payment.')
      })
  },

  'fillFormProviderRequest' : function (browser) {
    browser
      .setValue('input[name=ownerFirstName]',model.ownerFirstName)
      .setValue('input[name=ownerLastName]',model.ownerLastName)
      .setValue('input[name=teamName]',model.teamName)
      .setValue('input[name=month]',model.month)
      .setValue('input[name=day]',model.day)
      .setValue('input[name=year]',model.year)
      .setValue('input[name=Address]',model.Address)
      .setValue('input[name=AddressLineTwo]',model.Address)
      .setValue('input[name=ownerEmail]',model.ownerEmail)
      .setValue('input[name=ownerPhone]',model.ownerPhone)
      .setValue('input[name=city]',model.city)
      
      .setValue('#state',model.state)
      
      .setValue('input[name=zipCode]',model.zipCode)
      .setValue('input[name=ownerSSN]',model.ownerSSN)
      
      .setValue('#businessType',model.businessType)
      
      .setValue('input[name=businessName]',model.businessName)
      //.setValue('input[name=EIN]',model.EIN)
      .setValue('input[name=aba]',model.aba)
      .setValue('input[name=dda]',model.dda)
      .setValue('input[name=ddaVerification]',model.ddaVerification)
  },
  
  'providerSuccess' : function (browser) {
    browser
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('#btnSave', 1000)
      .click('#btnSave')
      .pause(15000)
      .url(function(url){
        this.assert.equal(url.value,'http://localhost:9000/commerce/provider/success')
      })
  }
};