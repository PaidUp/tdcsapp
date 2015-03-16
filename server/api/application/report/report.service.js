'use strict';
var User = require('../../user/user.model');
var Relation = require('../../user/relation/relation.model');

function parentsBuy(cb) {
  var result = [];
  var userIds = [];
  var familyIds = [];
  User.find({BPCustomerId: {$exists: true}}, {
    firstName: true,
    lastName: true,
    BPCustomerId: true
  }, function (err, userBuy) {
    for (var i = 0; i < userBuy.length; i++) {
      userIds.push(userBuy[i]._id);
    }
    Relation.find({sourceUserId: {$in: userIds}}, function (err, relations) {
      for (var j = 0; j < relations.length; j++) {
        familyIds.push(relations[j].sourceUserId, relations[j].targetUserId);
      }
      User.find({_id: {$in: familyIds}}, {
        email: true,
        firstName: true,
        lastName: true,
        BPCustomerId: true,
        teams: true
      }, function (err, userFamily) {
        for (var k = 0; k < userFamily.length; k++) {
          var user = userFamily[k];
          var type = "child";
          var usersString = userIds.toString();
          var userIdString = user._id.toString();
          if (usersString.indexOf(userIdString) != -1) {
            type = "parent";
          }
          var teams = [];
          for (var l = 0; l < user.teams.length; l++) {
            teams.push(user.teams[l].sku);
          }
          result.push([type, user._id, user.firstName, user.lastName, user.email, user.BPCustomerId, teams]);
        }
        return cb(err, result);
      });
    });
  });
}

exports.parentsBuy = parentsBuy;
