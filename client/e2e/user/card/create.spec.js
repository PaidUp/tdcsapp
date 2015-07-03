'use strict';
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expectChai = chai.expect;
var driver = browser.driver;

describe('User update account', function () {
  var temp;
  it("charge 0 cards", function () {
    browser.get('/user/payments');
    var cards = element.all(by.repeater('card in cards'));
    expect(cards.count()).toEqual(0);
    temp = element(by.id('hrefAddNewCard')).click();
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
    //browser.waitForAngular()
    //expect(temp.isDisplayed());
    element.all(by.repeater('card in cards')).then(function(elements) {
      return expect(elements).toEqual([]);//validate button#add-athlete-btn element not exist.
      //expect(element(by.id('hrefAddNewCard')).getText()).toEqual('ADD NEW CARD');
    });
  });

});