'use strict';
var assert = require('chai').assert;
var userService = require('../services/user.service');
var authService = require('../services/auth.service');
var tokenTDUser = 'TDUserToken-CHANGE-ME!';

describe.only('user.smokedtest', function () {
  
  before(function(done){
    userService.init({ 
      urlPrefix : '/api/v1',
      isHttps: false,
      host: 'localhost',
      port: 9001,
      token:'TDUserToken-CHANGE-ME!'}
    );
    done();
  });

  it('create user', function (done) {
    

    userService.create({}, function (err, data) {
      if (err) {
          assert(err.code);
          return done();
      }
      return done(data);
    });
  });

  it('auth signup', function (done) {
    authService.signup({}, function (err, data) {
        if (err) {
            assert(err.code);
            return done();
        }
        return done(data);
    });
  });

  it('user current', function (done) {
    userService.current('', function (err, data) {
        if (err) {
            return done(err);
        }
        assert(data);
        return done();
    });
  });

  it('logout', function (done) {
    authService.logout('', function (err, data) {
        if (err) {
            return done(data);
        }
        return done();

    });
  });

  it('user login local', function (done) { 
    authService.login({}, function (err, data) {
        if (err) {
            assert(err.name);
            return done();
        }
        return done(data);
    });
  });

  it('user login facebook', function (done) {
    this.timeout(5000);
    var credentials = {
      facebookToken: 'FAKE'
    }; 
    authService.facebook(credentials, function (err, data) {
        if (err) {
            assert(err.code);
            return done();
        }
        return done(data);
    });
  });

  it('verify request', function (done) {
    authService.verifyRequest('', function (err, data) {
        if (err) {
            assert.deepEqual(err, {});
            return done();
        }
        return done(data);
    });
  });

  it('verify', function (done) {
    authService.verify({}, '', function (err, data) {
        if (err) {
            assert.deepEqual(err, {});
            return done();
        }
        return done(data);
    });
  });

  it('password reset request', function (done) {
    authService.passwordResetRequest({}, function (err, data) {
        if (err) {
            assert(err.code);
            return done();
        }
        return done(data);
    });
  });

  it('password reset', function (done) {
    this.timeout(5000);
    authService.passwordReset({}, function (err, data) {
        if (err) {
            assert(err.code);
            return done();
        }
        return done(data);
    });
  });

  it('password update', function (done) {
    authService.passwordUpdate({}, '', function (err, data) {
        if (err) {
            assert.deepEqual(err, {});
            return done();
        }
        return done(data);
    });
  });

  it('email update', function (done) {
    authService.emailUpdate({}, '', function (err, data) {
        if (err) {
            assert.deepEqual(err, {});
            return done();
        }
        return done(data);
    });
  });

  it('user update', function (done) {
    userService.update({}, '', function (err, data) {
        if (err) {
            assert.deepEqual(err, {});
            return done();
        }
        return done(data);
    });
  });

  it('userService.find', function (done) {
    userService.find({}, function (err, data) {
      if (err) {
        return done(err);
      }
        assert.isArray(data);
      return done();
    });
  });

  it('user contact create', function (done) {
    userService.contactCreate({}, '', function (err, data) {
        if (err) {
            assert.deepEqual(err, {});
            return done();
        }
        return done(data);
    });
  });

  it('user contact list', function (done) {
    userService.contactList({}, '', function (err, data) {
        if (err) {
            assert.deepEqual(err, {});
            return done();
        }
        return done(data);
    });
  });

  it('user contact load', function (done) {
    userService.contactLoad('', '', function (err, data) {
        if (err) {
            assert.deepEqual(err, {});
            return done();
        }
        return done(data);
    });
  });

  it('user contact update', function (done) {
    userService.contactUpdate({}, '', '', function (err, data) {
        if (err) {
            assert.deepEqual(err, {});
            return done();
        }
        return done(data);
    });
  });

  it('user contact delete', function (done) {
    userService.contactDelete({}, '', '', function (err, data) {
        if (err) {
            assert.deepEqual(err, {});
            return done();
        }
        return done(data);
    });
  });
  
  it('user address create', function (done) {
    userService.addressCreate({}, '', function (err, data) {
        if (err) {
            assert.deepEqual(err, {});
            return done();
        }
        return done(data);
    });
  });

  it('user address list', function (done) {
    userService.addressList({}, '', function (err, data) {
        if (err) {
            assert.deepEqual(err, {});
            return done();
        }
        return done(data);
    });
  });

  it('user address load', function (done) {
    userService.addressLoad('', '', function (err, data) {
        if (err) {
            assert.deepEqual(err, {});
            return done();
        }
        return done(data);
    });
  });

  it('user address update', function (done) {
    userService.addressUpdate({}, '', '', function (err, data) {
        if (err) {
            assert.deepEqual(err, {});
            return done();
        }
        return done(data);
    });
  });

  it('user address delete', function (done) {
    userService.addressDelete({}, '', '', function (err, data) {
        if (err) {
            assert.deepEqual(err, {});
            return done();
        }
        return done(data);
    });
  });

  it('create user (child)', function (done) {
    userService.create({}, function (err, data) {
        if (err) {
            assert(err.code);
            return done();
        }
        return done(data);
    });
  });

  it('user relation create', function(done) {
    userService.relationCreate({}, function (err, data) {
        if (err) {
            return done();
        }
        return done(data);
    });
  });

  it('user relation list', function(done) {
    userService.relationList('', function (err, data) {
        if (err) {
            assert.deepEqual(err, {});
            return done();
        }
        return done(data);
    });
  });

  //generic method
  it('user relation list', function(done) {
    userService.save({}, function (err, data) {
        if (err) {
            assert(err.code);
            return done();
        }
        return done(data);
    });
  });
});