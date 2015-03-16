'use strict';

describe('Controller: CreateAthleteCtrl', function () {

  // load the controller's module
  beforeEach(module('convenienceApp'));

  var CreateAthleteCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreateAthleteCtrl = $controller('CreateAthleteCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});