'use strict';
//var Utils = require('../../utils/utils');
var modelProvider = require('../../models').provider;
var commerceRequestpo = require('../../page-objects/commerceRequest.po.js');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expectChai = chai.expect;

describe('Provider request', function () {
  var teamName, btnSave, ownerFirstName, ownerLastName, month, day, year, Address, ownerEmail, ownerPhone, city, state,
  zipCode, ownerSSN, businessType, businessName, EIN, aba, dda, ddaVerification;
  beforeEach(function() {
      teamName = element(by.model('provider.teamName'));
      ownerFirstName = element(by.model('provider.ownerFirstName'));
      ownerLastName = element(by.model('provider.ownerLastName'));
      month = element(by.model('provider.date.month'));
      day = element(by.model('provider.date.day'));
      year = element(by.model('provider.date.year'));
      Address = element(by.model('provider.Address'));
      ownerEmail = element(by.model('provider.ownerEmail'));
      ownerPhone = element(by.model('provider.ownerPhone'));
      city = element(by.model('provider.city'));
      state = element(by.model('provider.state'));
      zipCode = element(by.model('provider.zipCode'));
      ownerSSN = element(by.model('provider.ownerSSN'));
      businessType = element(by.model('provider.businessType'));
      businessName = element(by.model('provider.businessName'));
      EIN = element(by.model('provider.EIN'));
      aba = element(by.model('provider.aba'));
      dda = element(by.model('provider.dda'));
      ddaVerification = element(by.model('provider.ddaVerification'));
      btnSave = element(by.id('btnSave'));
  });
  
  it("coach can not see options of parent and pre charged info.", function (done) {
    browser.get('/commerce/provider/request');
    element.all(by.css('button#add-athlete-btn')).then(function(elements) {
      expect(elements).toEqual([]);//validate button#add-athlete-btn element not exist.
      expect(ownerFirstName.getAttribute('value')).toEqual('Zuly');
      expect(ownerLastName.getAttribute('value')).toEqual('Alcaraz');
      done();
    });
  });

  it("should fill form provider request", function (done) {
    btnSave.click();
    //TODO: validate all message. for now happy path.
    //var nameRequired = element(by.id('nameRequired'));
    //expect(nameRequired.isDisplayed()).toBe(true);;
    teamName.sendKeys(modelProvider.teamName);
    //expect(nameRequired.isDisplayed()).toBe(false);
    month.sendKeys(modelProvider.month);
    day.sendKeys(modelProvider.day);
    year.sendKeys(modelProvider.year);
    Address.sendKeys(modelProvider.Address);
    ownerEmail.sendKeys(modelProvider.ownerEmail);
    ownerPhone.sendKeys(modelProvider.ownerPhone);
    city.sendKeys(modelProvider.city);
    state.sendKeys(modelProvider.state);
    zipCode.sendKeys(modelProvider.zipCode);
    ownerSSN.sendKeys(modelProvider.ownerSSN);
    businessType.sendKeys(modelProvider.businessType);
    businessName.sendKeys(modelProvider.businessName);
    EIN.sendKeys(modelProvider.EIN);
    aba.sendKeys(modelProvider.aba);
    dda.sendKeys(modelProvider.dda);
    ddaVerification.sendKeys(modelProvider.ddaVerification);
    btnSave.click();
    browser.getLocationAbsUrl().then(function (url) {
      expect(url).toEqual('/commerce/provider/success');
    });
    /*browser.wait(function () {
    }, 5000);*/
    done();
  });

});