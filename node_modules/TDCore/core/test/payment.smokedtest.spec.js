
'use strict';
var assert = require('assert');
var paymentService = require('../services/payment.service.js');

var conn = {
  token: 'nodePaymentPass',
  urlPrefix : '/api/v1',
  isHttps: false,
  host: 'localhost',
  port: 9005
};

function createOrder(order, cb){
    paymentService.createOrder(order, function(err, datao){
        if(err){
            return cb(err);
        }
        return cb(null, datao);
    });
};

describe.only('payment services test', function () {
  paymentService.init(conn);
  it('createCustomer', function (done) {this.timeout(60000);
    paymentService.createCustomer({}, function (err, data) {
      if (err) {
        return done(err);
      }
      assert.equal('ValidationError', data.code);
      return done();
    });
  });

  it('createCard',function(done){
      this.timeout(60000);
      paymentService.createCard({}, function(err, data){
          if(err){
              return done(err);
          }
          assert.equal('ValidationError', data.code);
          return done();
      })
  });

  it('associateCard', function(done){
      this.timeout(60000);
      paymentService.associateCard({}, function(err, data){
          if(err){
            return done(err);
          }
          assert.equal('ValidationError', data.code);
          return done();
      });
  });
  it('createBank', function(done){
      this.timeout(60000);
      paymentService.createBank({}, function(err, data){
          if(err){
              return done(err);
          }
          assert.equal('ValidationError', data.code);
          return done();
      });
  });
  it('associateBank', function(done){
      this.timeout(60000);
      paymentService.associateBank({}, function(err, data){
          if(err){
              return done(err);
          }
          assert.equal('ValidationError', data.code);
          return done();
      })
  });
  it('createOrder', function(done){
      this.timeout(60000);
      createOrder({}, function(err, datao){
          if(err){
              return done(err);
          }

          assert.equal('ValidationError', datao.code);
          return done();
      });
  });
    it('createOrderBank', function(done){
        this.timeout(60000);
        createOrder({}, function(err, datao){
            if(err){
                return done(err);
            }
            assert.equal('ValidationError', datao.code);
            return done();
        });
    });
  it('debitCard', function(done){
      this.timeout(60000);
      paymentService.debitCard({}, function(err, data){
          if(err)
          return done(err);
          assert.equal('ValidationError', data.code);
          return done();
      });
  });

  it('createBankVerification', function(done){
      this.timeout(60000);
      paymentService.createBankVerification({}, function(err, data){
         if(err){
             done(err);
         }
          assert.equal('ValidationError', data.code);
          return done();
      });
  });

  it('confirmBankVerification', function(done){
    this.timeout(60000);
    paymentService.confirmBankVerification({}, function(err, data){
        if(err){
        done(err);
      }
      assert.equal('ValidationError', data.code);
      return done();
      });
  });

  it('debitBank', function(done){
      this.timeout(60000);
          paymentService.debitBank(null, function(err, data){
              if(err){
                  return done(err);
              }
              assert.equal('ValidationError', data.code);
              return done();
          });
  });
  it('listCustomerBanks', function(done){
  this.timeout(60000);
  paymentService.listCustomerBanks(null, function(err, data){
       if(err){
          return done(err);
      }
      assert.equal(404, data.code);
      return done();
    });
  });
  it('listCards', function(done){
      this.timeout(60000);
      paymentService.listCards('...', function(err, data){
          if(err){
               return done(err);
          }
          assert.equal(404, data.code);
          return done();
        });
  });
  it('loadBankVerification', function(done){
      this.timeout(60000);
      paymentService.loadBankVerification(null, function(err, data){
          if(err){
              return done(err);
          }
          assert.equal(404, data.code);
          return done();
      });
  });
    it('prepareBank', function(done){
        this.timeout(60000);
        paymentService.prepareBank({}, function(err, data){
            if(err){
                return done(err);
            }
            assert.equal('ValidationError', data.code);
            return done();
        });
    })
    it('prepareCard', function(done){
        this.timeout(60000);
        paymentService.prepareCard({}, function(err, data){
            if(err){
                return done(err);
            }
            assert.equal('ValidationError', data.code);
            return done();
        });
    });

    it('fetchBank', function(done){
        this.timeout(60000);
        paymentService.fetchBank(null, function(err, data){
            if(err){
                return done(err);
            }
            assert.equal(404, data.code);
            return done();
        });
    });
    it('fetchCard', function(done){
        this.timeout(60000);
        paymentService.fetchCard(null, function(err, data){
            if(err){
                return done(err);
            }
            assert.equal(404, data.code);
            return done();
        });
    });

    it('getUserDefaultBankId', function(done){
        this.timeout(60000);
        paymentService.getUserDefaultBankId(null, function(err, data){
            if(err){
                return done(err);
            }
            assert.equal(404, data.code);
            return done();
        });
    });
    it('getUserDefaultCardId', function(done){
        this.timeout(60000);
        paymentService.getUserDefaultCardId(null, function(err, data){
            if(err){
                return done(err);
            }
            assert.equal(404, data.code);
            return done();
        });
    });
    it('deleteBankAccount', function(done){
        this.timeout(60000);
        paymentService.deleteBankAccount({}, function(err, data){
            if(err){
                return done(err);
            }
            assert.equal('ValidationError', data.code);
            return done();
        });
    });
    it('test change connection object', function(done){
      this.timeout(60000);
      conn.urlPrefix =  '/api/v2';
      paymentService.init(conn);
      paymentService.associateBank({}, function(err, data){
        if(err){
          done(err);
        }
        assert.equal(404, data.code);
        done();
      });
    });
});