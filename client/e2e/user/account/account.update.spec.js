'use strict';
//var Utils = require('../../utils/utils');
//var modelProvider = require('../../models').provider;
//var commerceRequestpo = require('../../page-objects/commerceRequest.po.js');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expectChai = chai.expect;

describe('User update account', function () {
  var firstName, lastName, email, password, sphone, saddress1, scity, saddress2, sstate, szipCode, sameBillingAsShiping,
  baddress1, baddress2, bstate, bzipCode, btnSave;
  beforeEach(function() {
      firstName = element(by.model('user.firstName'));
      lastName = element(by.model('user.lastName'));
      email = element(by.model('user.email'));
      password = element(by.model('user.password'));
      sphone = element(by.model('shipping.phone'));
      saddress1 = element(by.model('shipping.address.address1'));
      scity = element(by.model('shipping.address.city'));
      saddress2 = element(by.model('shipping.address.address2'));
      sstate = element(by.model('shipping.address.state'));
      szipCode = element(by.model('shipping.address.zipCode'));
      sameBillingAsShiping = element(by.model('sameBillingAsShiping'));
      baddress1 = element(by.model('billing.address.address1'));
      baddress2 = element(by.model('billing.address.address2'));
      bstate = element(by.model('billing.address.state'));
      bzipCode = element(by.model('billing.address.zipCode'));
      btnSave = element(by.id('btnSaveAccount'));
  });
  
  it("charge info user and validate permissions", function (done) {
    browser.get('/user/account');
    element.all(by.css('button#add-athlete-btn')).then(function(elements) {
      expect(elements).toEqual([]);//validate button#add-athlete-btn element not exist.
      expect(firstName.getAttribute('value')).toEqual('Zuly');
      expect(lastName.getAttribute('value')).toEqual('Alcaraz');
      done();
    });
  });

  /*it.skip("should fill form provider request", function (done) {
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
    }, 5000);
    done();
  });*/

});