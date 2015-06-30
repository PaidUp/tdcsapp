'use strict';
//var Utils = require('../../utils/utils');
//var models = require('../../models');
var commerceRequestpo = require('../../page-objects/commerceRequest.po.js');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expectChai = chai.expect;
//var driver = browser.driver;

describe('Provider request', function () {
  var teamName, btnSave, ownerFirstName, ownerLastName, month, day, year;
  beforeEach(function() {
      //browser.get('/commerce/provider/request');
      teamName = element(by.model('provider.teamName'));
      ownerFirstName = element(by.model('provider.ownerFirstName'));
      ownerLastName = element(by.model('provider.ownerLastName'));
      month = element(by.model('provider.date.month'));
      day = element(by.model('provider.date.day'));
      year = element(by.model('provider.date.year'));
      btnSave = element(by.id('btnSave'));
  });
  
  it("coach can not see options of parent and pre charged info.", function () {
    var addAthleteBtn = element(by.css('button#add-athlete-btn'));
    console.log('addAthleteBtn',addAthleteBtn);
    expect(addAthleteBtn.getAttribute('innerText')).toEqual('');

    expect(ownerFirstName.getAttribute('value')).toEqual('Zuly');
    expect(ownerLastName.getAttribute('value')).toEqual('Alcaraz');
    btnSave.click();
  });

  /*it("should fill form provider request", function() {
    //browser.get('/commerce/provider/request');
    //teamName.sendKeys('america de cali');
    element(by.css('form[name=checkoutForm]')).submit();
    browser.wait(function () {
      return browser.isElementPresent(element(by.css('.titleThankyouBanner')));
    }, 15000);
    browser.getLocationAbsUrl().then(function (url) {
      expect(url).equal('/commerce/checkout/success');
      var thankyouTitle = element(by.css('.titleThankyouBanner')).getText();
      expect(thankyouTitle).equal('Thanks for your order!');
    });
    
  });*/

});