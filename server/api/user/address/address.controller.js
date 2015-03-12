var _ = require('lodash');
var mongoose = require('mongoose');
var addressService = require('./address.service');

exports.create = function(req, res, next) {
  addressService.create(req.body, function (data){
    res.json(data);
  });
};

exports.list = function(req, res, next) {
  var user = { userId: req.params.id };
  addressService.list(user, function (data){
    res.json(data);
  });
};

exports.load = function(req, res, next) {
  addressService.load(req.params, function (data){
    res.json(data);
  });
};

exports.update = function(req, res, next) {
  addressService.update(req.body, function (data){
    res.json(data);
  });
};

// exports.delete = function(req, res, next) {
//   TDUserService.addressDelete(req.body, function (data){
//     res.json(data);
//   });
// };