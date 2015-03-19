'use strict';

var httpUtil = require('../http/http.util');
var config = require('../config/index');
var urlencode = require('urlencode');

function init(connection) {
    config.app.connection = connection;
}

function create(data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/user/create', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function current(tokenUser, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.GET, '/user/current/?token=' + urlencode(tokenUser), null, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function update(data, userId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/user/update/userId/' + urlencode(userId), data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function find(data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/user/find', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function contactCreate(data, userId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/user/contact/create/userId/' + urlencode(userId), data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function contactList(data, userId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/user/contact/list/userId/' + urlencode(userId), data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function contactLoad(userId, contactId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.GET, '/user/contact/load/userId/' + urlencode(userId) + '/contactId/' + urlencode(contactId), null, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function contactUpdate(data, userId, contactId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.PUT, '/user/contact/update/userId/' + urlencode(userId) + '/contactId/' + urlencode(contactId), data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function contactDelete(data, userId, contactId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.DELETE, '/user/contact/delete/userId/' + urlencode(userId) + '/contactId/' + urlencode(contactId), data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function addressCreate(data, userId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/user/address/create/userId/' + urlencode(userId), data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function addressList(data, userId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/user/address/list/userId/' + urlencode(userId), data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function addressLoad(userId, addressId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.GET, '/user/address/load/userId/' + urlencode(userId) + '/addressId/' + urlencode(addressId), null, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function addressUpdate(data, userId, addressId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.PUT, '/user/address/update/userId/' + urlencode(userId) + '/addressId/' + urlencode(addressId), data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function addressDelete(data, userId, addressId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.DELETE, '/user/address/delete/userId/' + urlencode(userId) + '/addressId/' + urlencode(addressId), data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function relationCreate(data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/user/relation/create', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function relationList(userId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.GET, '/user/relation/list/userId/' + urlencode(userId), null, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

function save(data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/user/save', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
}

exports.create = create;
exports.current = current;
exports.update = update;
exports.find = find;
exports.contactCreate = contactCreate;
exports.contactList = contactList;
exports.contactLoad = contactLoad;
exports.contactUpdate = contactUpdate;
exports.contactDelete = contactDelete;
exports.addressCreate = addressCreate;
exports.addressList = addressList;
exports.addressLoad = addressLoad;
exports.addressUpdate = addressUpdate;
exports.addressDelete = addressDelete;
exports.relationCreate = relationCreate;
exports.relationList = relationList;
exports.init = init;
exports.save = save;
