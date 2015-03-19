'use strict';

var httpUtil = require('../http/http.util');
var config = require('../config/index');

function init(connection) {
    config.app.connection = connection;
}

function signup(data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/auth/local/signup', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function logout(tokenUser, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.GET, '/auth/logout/userId/' + tokenUser, null, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function login(data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/auth/local/login', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function facebook(data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/auth/facebook/', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function verifyRequest(userId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.GET, '/auth/verify-request/userId/' + userId, null, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function verify(data, userId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/auth/verify/userId/' + userId, data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function passwordResetRequest(data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/auth/password/reset-request', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function passwordReset(data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/auth/password/reset', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function passwordUpdate(data, userId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/auth/password/update/userId/' + userId, data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function emailUpdate(data, userId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/auth/email/update/userId/' + userId, data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

exports.signup = signup;
exports.logout = logout;
exports.login = login;
exports.facebook = facebook;
exports.verifyRequest = verifyRequest;
exports.verify = verify;
exports.passwordResetRequest = passwordResetRequest;
exports.passwordReset = passwordReset;
exports.passwordUpdate = passwordUpdate;
exports.emailUpdate = emailUpdate;
exports.init = init;