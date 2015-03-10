'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var TDUserService = require('TDCore').userService;
var config = require('../../config/environment');

// Creates a new user in the DB.
exports.create = function(req, res) {
  TDUserService.create(req.body, config.TDTokens.user, function(err, data){
    res.json(200, data);
  });
};

exports.current = function(req, res, next) {
  TDUserService.current(req.query, config.TDTokens.user, req.query.token, function(err, data){
    res.json(data);
  });
};

exports.update = function(req, res, next) {
  TDUserService.update(req.body, config.TDTokens.user, req.body.userId, function(err, data){
    res.json(data);
  });
};

// exports.getUser = function(req, res, next) {
//   var userId = req.user._id;
//   var filter = {createdBy : userId, _id:req.params.id};
//   userService.findOne(filter, function(err, userAthlete) {
//     if(err) return handleError(res, err);
//     if (!userAthlete) return res.json(403,{
//       "code": "User permission error",
//       "message": "You don't have permission for this operation"
//     });
//     res.json(200,userAthlete);
//   });
// };

// function handleError(res, err) {
//   var httpErrorCode = 500;
//   var errors = [];

//   if(err.name === "ValidationError") {
//     httpErrorCode = 400;
//   }

//   return res.json(httpErrorCode, {code : err.name, message : err.message, errors : err.errors});
// }