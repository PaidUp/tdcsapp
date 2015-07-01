'use strict';

var Utils = function () {
  this.getIdFromURL = function (url) {
    var urlPath = url.split('/');
    return urlPath[urlPath.length - 1];
  };

  // url
  // posIds = [], an array of desired positions to lookup the ids from url
  this.getIdsfromUrl = function (url, posIds) {
    var urlPath = url.split('/');
    if (url.charAt(0) === '/') {
      urlPath.splice(0, 1);
    }
    var ids = [];

    posIds.forEach(function (desiredPosition) {
      ids.push(urlPath[desiredPosition]);
    });
    return ids;
  };

  this.selectItem = function (elementArray, opt) {
    var options = opt || {};
    return elementArray.count().then(function (elementCount) {
      if (options.chopFirst) {
        elementCount--;
      }
      if (options.chopLast) {
        elementCount--;
      }
      var selection = Math.ceil(Math.random() * elementCount) + (options.chopFirst ? 0 : 1);
      return elementArray.get(selection);
    });
  };

  this.selectDropdownByNumber = function(element, index, milliseconds) {
    element.all(by.tagName('option'))
      .then(function(options) {
        options[index].click();
      });
    if (typeof milliseconds !== 'undefined') {
      browser.sleep(milliseconds);
    }
  };
};



module.exports = new Utils();
