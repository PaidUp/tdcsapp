'use strict';

var athlete = function () {

  this.fillFormNewAthlete = function(athlete) {
    element(by.model('athlete.firstName')).sendKeys(athlete.firstName);
    element(by.model('athlete.lastName')).sendKeys(athlete.lastName);
    if (athlete.gender === 'male') {
      element(by.css('.male-gender')).click();
    }else if (athlete.gender === 'female') {
      element(by.css('.female-gender')).click();
    }
    element(by.model('date.month')).sendKeys(athlete.date.month);
    element(by.model('date.day')).sendKeys(athlete.date.day);
    element(by.model('date.year')).sendKeys(athlete.date.year);

    this.name = element(by.model('athlete.firstName')).getAttribute('value');
    this.lastName = element(by.model('athlete.lastName')).getAttribute('value');
    this.gender = element(by.model('athlete.gender')).getAttribute('value');
    this.month = element(by.model('date.month')).getAttribute('value');
    this.day = element(by.model('date.day')).getAttribute('value');
    this.year = element(by.model('date.year')).getAttribute('value');
  };
  
};

module.exports = new athlete();