'use strict';

angular.module('convenienceApp')
  .service('ContactService', function ($resource) {

    this.ctaModalFlag = 'hasBeenSentCTA';

    var ApplicationContact = $resource('/api/v1/application/contact',{},{});
    this.contactUs = function (contactInfo) {
      return ApplicationContact.save(contactInfo).$promise;
    };
  });
