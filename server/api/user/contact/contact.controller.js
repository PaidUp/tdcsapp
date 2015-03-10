var _ = require('lodash');
var mongoose = require('mongoose');
var TDUserService = require('TDCore').userService;
var config = require('../../../config/environment');

exports.create = function(req, res, next) {
  TDUserService.contactCreate(req.body, config.TDTokens.user, req.body.userId, function (err, data){
  	console.log('data contactCreate', data);
    res.json(data);
  });
};

exports.list = function(req, res, next) {
  TDUserService.contactList(req.params, config.TDTokens.user, req.params.id, function (err, data){
  	console.log('data contactList', data);
    res.json(data);
  });
};

exports.load = function(req, res, next) {
  TDUserService.contactLoad(
    req.body, 
    config.TDTokens.user, 
    req.body.userId, 
    req.body.contactId, 
    function (err, data){
      res.json(data);
    }
  );
};

// exports.update = function(req, res, next) {
//   // console.log('Contact Update');
//   // console.log('req.body.userId', req.body.userId);
//   TDUserService.contactUpdate(
//     req.body, 
//     config.TDTokens.user, 
//     req.body.userId, 
//     req.body.contactId, 
//     function (err, data){
//       res.json(data);
//     }
//   );
// };

// exports.delete = function(req, res, next) {
//   TDUserService.contactDelete(
//     req.body, 
//     config.TDTokens.user, 
//     req.body.userId, 
//     req.body.contactId, 
//     function (err, data){
//       res.json(data);
//     }
//   );
// };