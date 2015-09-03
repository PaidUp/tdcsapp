/**
 * Created by riclara on 7/28/15.
 */
'use strict'

angular.module('convenienceApp')
  .service('TrackerService', function ($analytics, AuthService) {

    var TrackerService = this;


    TrackerService.trackFormErrors = function (event, form) {
      var user = AuthService.getCurrentUser();
      var obj = {formErrors : []}
      if(user){
        obj.email = user.email;
      }
      if(form.$error){
        angular.forEach(form.$error, function(value, key){
          var field = {};
          field[key] = [];
          angular.forEach(value, function(item){
            console.log('field' , field[key])
            field[key].push(item.$name);
          });

          console.log('obj' , obj);
          obj.formErrors.push(field)
        });
        if(obj.formErrors.length){
          $analytics.eventTrack(event, obj);
        }
      }
    };

    TrackerService.create = function(event, objDetails){
      var user = AuthService.getCurrentUser();
      if(!objDetails){
        objDetails = {};
      }
      if(user){
        objDetails.email = user.email;
      }
      $analytics.eventTrack(event, objDetails);
    }
  });
