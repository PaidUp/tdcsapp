'use strict';

var _ = require('lodash');
var TDCore = require('TDCore');
var User = require('./user.model');
var userService = require('./user.service');
var mongoose = require('mongoose');
var authService = require('../auth/auth.service');
var config = require('../../config/environment');

// Creates a new user in the DB.
exports.create = function(req, res) {
  TDCore.userService.create(req.body,config.nodePass.user.token, function(err, data){
    res.json(200, data);
  });
};

// exports.me = function(req, res, next) {
//   var userId = req.user._id;
//   User.findOne({
//     _id: userId
//   }, '-salt -hashedPassword -roles -verify.token -verify.updatedAt -role -updateAt -createAt -resetPassword', function(err, user) { // don't ever give out the password or salt
//     if (err) return next(err);
//     if (!user) return res.json(401);
//     res.json(user);
//   });
// };

// exports.update = function(req, res, next) {
//   var userId = req.user._id;
//   var userUpdate = req.body.userId;
//   var isValidFirstName = userService.validateFirstNameSync(req.body.firstName);
//   if(!isValidFirstName){
//     return res.json(400, {
//       "code": "ValidationError",
//       "message": "First name is not accepted"
//     });
//   }

//   var isValidLastName = userService.validateLastNameSync(req.body.lastName);
//   if(!isValidLastName){
//     return res.json(400, {
//       "code": "ValidationError",
//       "message": "Last name is not accepted"
//     });
//   }
//   var filter = userId;
//   if(userUpdate != userId) {//Here - validate if user is parent or athlete.
//     var isValidGender = userService.validateGenderSync(req.body.gender);
//     if(!isValidGender){
//       return res.json(400, {
//         "code": "ValidationError",
//         "message": "Gender is not accepted"
//       });
//     }
//     var isValidBirthDate = userService.validateBirthDateSync(req.body.birthDate);
//     if(!isValidBirthDate){
//       return res.json(400, {
//         "code": "ValidationError",
//         "message": "Birthdate is not accepted"
//       });
//     }
//     filter = {createdBy : userId, _id:userUpdate};
//   }
//   userService.findOne(filter, function(err, userFind) {
//     if(err) return res.json(409,res, err);
//     if(!userFind){
//       return res.json(404,{
//         "code": "AuthCredentialNotExists",
//         "message": "User Id does not exist"
//       });
//     }
//     userFind.firstName = req.body.firstName;
//     userFind.lastName = req.body.lastName;
//     if(userUpdate != userId){//move to user.service
//       userFind.gender = req.body.gender;
//       userFind.birthDate = req.body.birthDate;
//     }
//     userService.save(userFind, function(err, userSave) {
//       if(err) return handleError(res, err);
//       res.send(200);
//     });
//   });
// };

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
