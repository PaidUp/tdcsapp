'use strict';
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

  it("should fill form user account and update", function (done) {
    sphone.sendKeys('1233211239');
    saddress1.sendKeys('street one');
    scity.sendKeys('medellin');
    saddress2.sendKeys('street two');
    sstate.sendKeys('tx');
    szipCode.sendKeys('12312');
    btnSave.click();
    done();
  });

  it("account updated", function (done) {
    browser.get('/user/account');
    element.all(by.css('button#add-athlete-btn')).then(function(elements) {
      expect(elements).toEqual([]);
      expect(sphone.getAttribute('value')).toEqual('1233211239');
      expect(saddress1.getAttribute('value')).toEqual('street one');
      expect(scity.getAttribute('value')).toEqual('medellin');
      done();
    });
  });

});