'use strict';

angular.module('convenienceApp')
  .directive('onCarouselChange', function ($parse) {
    return {
      require: 'carousel',
      restrict: 'A',
      link: function (scope, element, attrs, carouselCtrl) {
        var fn = $parse(attrs.onCarouselChange);
        var origSelect = carouselCtrl.select;
        carouselCtrl.select = function (nextSlide, direction) {
          if (direction) {
            fn(scope, {
              nextSlide: nextSlide,
              direction: direction
            });
          }
          origSelect(nextSlide, direction);
        };
      }
    };
  });