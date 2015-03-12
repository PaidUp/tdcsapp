var _ = require('lodash');
var relationService = require('./relation.service');

exports.create = function(req, res, next) {
	relationService.create(req.body, function (data) {
    res.json(data);
  });
};

exports.list = function(req, res, next) {
  relationService.list(req.params, function (data) {
    res.json(data);
  });
};