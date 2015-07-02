'use strict';
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expectChai = chai.expect;
var driver = browser.driver;

describe('User update account', function () {
  var firstName, lastName, email, password, sphone, saddress1, scity, saddress2, sstate, szipCode, sameBillingAsShiping,
  baddress1, baddress2, bstate, bzipCode, btnSave;
  beforeEach(function() {
      /*firstName = element(by.model('user.firstName'));
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
      btnSave = element(by.id('btnSaveAccount'));*/
  });
  
  it("charge 0 cards", function () {
    browser.get('/user/payments');
    var cards = element.all(by.repeater('card in cards'));
    expect(cards.count()).toEqual(0);
    element(by.id('hrefAddNewCard')).click();
    //done();
  });

  it("redirect create new card and fill form", function () {
    browser.getLocationAbsUrl().then(function (url) {
      expect(url).toEqual('/user/card/create');
    });
    element(by.model('card.nameOnCard')).sendKeys('name card');
    element(by.model('card.cardNumber')).sendKeys('4111111111111111');
    element(by.model('card.expirationDate.month')).sendKeys('12');
    element(by.model('card.expirationDate.year')).sendKeys('2020');
    element(by.model('card.securityCode')).sendKeys('123');
    element(by.model('card.zipCode')).sendKeys('12312');
    element(by.model('card.nameOnCard')).sendKeys('name card');
    element(by.css('.btnSignUp')).click();
    //done();
  });

  it("credict card created.", function () {
    //expect(browser.getCurrentUrl()).toBe('/user/payments');
    return browser.sleep(10000).then(function() {
      browser.get('/user/payments').then(function(){
      });
    });
    //TODO
    expect(browser.getCurrentUrl()).toBe('/user/payments');
    expect(element(by.id('hrefAddNewCard')).isPresent()).toEqual(true);
    var cards = element.all(by.repeater('card in cards'));
    expect(cards.count()).toEqual(2);
    console.log('4');

  });

});