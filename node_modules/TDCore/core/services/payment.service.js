/**
 * Created by riclara on 3/2/15.
 */
'use strict';

var httpUtil = require('../http/http.util');
var config = require('../config/index');
var urlencode = require('urlencode');

exports.init = function (connection) {
    config.app.connection = connection;
}

exports.createCustomer = function (data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/customer/create', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
};

exports.createCard = function (data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/card/create', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
};

exports.associateCard = function (data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/card/associate', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
};

exports.createBank = function (data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/bank/create', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
};

exports.associateBank = function (data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/bank/associate', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
};

exports.createOrder = function (data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/order/create', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
};

exports.debitCard = function (data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/card/debit', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
};

exports.debitBank = function (data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/bank/debit', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
};

exports.listCustomerBanks = function (customerId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.GET, '/bank/list/customerId/' + urlencode(customerId), null, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
};

exports.listCards = function (customerId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.GET, '/card/list/customerId/' + urlencode(customerId), null, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
};

exports.createBankVerification = function (data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/bank/create/verification', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
};

exports.loadBankVerification = function (verificationId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.GET, '/bank/load/verification/verificationId/' + urlencode(verificationId), null, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
};

exports.deleteBankAccount = function (data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.DELETE, '/bank/delete', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
};

exports.confirmBankVerification = function (data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/bank/confirm/verification', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
};

exports.updateOrderDescription = function (data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/order/update/description', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
};

exports.prepareCard = function (data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/card/prepare', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
};

exports.prepareBank = function (data, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.POST, '/bank/prepare', data, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
};

exports.fetchBank = function (bankId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.GET, '/bank/fetch/bankId/' + urlencode(bankId), null, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
};

exports.fetchCard = function (cardId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.GET, '/card/fetch/cardId/' + urlencode(cardId), null, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
};

exports.fetchDebit = function (debitId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.GET, '/order/debit/debitId/' + urlencode(debitId), null, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
};

exports.getUserDefaultBankId = function (customerId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.GET, '/bank/default/customerId/' + urlencode(customerId), null, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
};

exports.getUserDefaultCardId = function (customerId, cb) {
    httpUtil.httpRequest(config.app.connection, config.methods.GET, '/card/default/customerId/' + urlencode(customerId), null, function (err, data) {
        if (err) {
            return cb(err);
        }
        if (data.status !== 200) {
            return cb(data.body);
        }
        return cb(null, data.body);
    });
};
