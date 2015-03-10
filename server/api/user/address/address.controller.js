var _ = require('lodash');
var mongoose = require('mongoose');
var TDUserService = require('TDCore').userService;
var config = require('../../../config/environment');

exports.create = function(req, res, next) {
  TDUserService.addressCreate(req.body, config.TDTokens.user, req.body.userId, function (err, data){
    res.json(data);
  });
};

exports.list = function(req, res, next) {
  TDUserService.addressList(req.params, config.TDTokens.user, req.params.id, function (err, data){
    res.json(data);
  });
};

// exports.load = function(req, res, next) {
//   TDUserService.addressLoad(
//     req.body, 
//     config.TDTokens.user, 
//     req.body.userId, 
//     req.body.addressId, 
//     function (err, data){
//       res.json(data);
//     }
//   );
// };

// exports.update = function(req, res, next) {
//   TDUserService.addressUpdate(
//     req.body, 
//     config.TDTokens.user, 
//     req.body.userId, 
//     req.body.addressId, 
//     function (err, data){
//       res.json(data);
//     }
//   );
// };

// exports.delete = function(req, res, next) {
//   TDUserService.addressDelete(
//     req.body, 
//     config.TDTokens.user, 
//     req.body.userId, 
//     req.body.addressId, 
//     function (err, data){
//       res.json(data);
//     }
//   );
// };