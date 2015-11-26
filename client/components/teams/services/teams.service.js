'use strict';

var Team = function(args) {
  var self = this;
  self.attributes = args;

  self.getImage = function (type) {
    var image = null;
    self.attributes.images.forEach(function (imageIter, index) {
      var imageTypeIndex = imageIter.types.indexOf(type);
      if (imageTypeIndex !== -1) {
        image = self.attributes.images[index];
      }
    });
    return image;
  };
};

angular.module('convenienceApp')
  .service('TeamService', function ($resource, $q) {

    var Teams = $resource('/api/v1/commerce/catalog/category/:categoryId', {}, {});
    var TeamApi = $resource('/api/v1/commerce/catalog/product/:productId', {}, {});
    var TeamsGrouped = $resource('/api/v1/commerce/catalog/grouped/product/:productId', {}, {});
    var TeamService = this;
    this.getTeams = function () {
      var teams = [];

      var deferred = $q.defer();
      Teams.query({categoryId:'teams'},function (teamsResponse) {
        teamsResponse.forEach(function (team, idx, arr) {

            if(team && team.status == 1) {
              teams.push(team);
            }
            if(arr.length - 1 == idx){
              deferred.resolve(teams);
            }

        });
      });
      return deferred.promise;
    };

    this.getTeamsGrouped = function (productId) {
      var teams = [];

      var deferred = $q.defer();

      TeamsGrouped.query({productId:productId}).$promise.then(function(teamsResponse){

      }, function(err){

      });



      TeamsGrouped.query({productId:productId},function (teamsResponse) {
        console.log('teamsResponse',teamsResponse);

        teamsResponse[0].simpleProducts.forEach(function (team, idx, arr) {

          if(team) {
            console.log('tema', team)
            if(true){//(team.status == 1){
              teams.push(team);
            }
            if(arr.length-1 == idx){
              deferred.resolve(teams);
            }
          }

        });



      });
      return deferred.promise;
    };

    this.getTeam = function (teamId) {
      var deferred = $q.defer();
      TeamApi.get({productId: teamId}).$promise.then(function (team) {
        deferred.resolve(new Team(team));
      });
      return deferred.promise;
    };

    this.getTeamSeasons = function (teamId) {
      return [
        {
          _id: 1,
          name: 'Spring Season'
        }
      ];
    };

    this.getTeamUnderAges = function (teamId) {
      return [
        {
          _id: 1,
          under: '9u'
        }
      ];
    };

    this.getRequiredItems = function (teamId) {
      return [
        {
          _id: '1',
          itemName: 'Official Jersey',
          price: 12.00,
          sizes: ['XS','S', 'M', 'L'],
          quantity: 0
        },
        {
          _id: '2',
          itemName: 'Official Cap',
          price: 12.00,
          sizes: ['XS','S', 'M', 'L'],
          quantity: 0
        }
      ];
    };
  });
