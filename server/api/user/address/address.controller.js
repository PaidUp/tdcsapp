var _ = require('lodash');
var mongoose = require('mongoose');
var addressService = require('./address.service');

exports.create = function(req, res, next) {
  addressService.create(req.body, function (err, data){
    if(err) res.json(402, err);
    res.json(200, data);
  });
};

exports.list = function(req, res, next) {
  var user = { userId: req.params.id };
  addressService.list(user, function (err, data){
    if(err) res.json(402, err);
    res.json(200, data);
  });
};

exports.load = function(req, res, next) {
  addressService.load(req.params, function (err, data){
    if(err) res.json(402, err);
    res.json(200, data);
  });
};

exports.update = function(req, res, next) {
  addressService.update(req.body, function (err, data){
    if(err) res.json(402, err);
    res.json(200, data);
  });
};

// exports.delete = function(req, res, next) {
//   TDUserService.addressDelete(req.body, function (data){
//     res.json(data);
//   });
// };