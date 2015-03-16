'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var assert = require('chai').assert;
var config = require('../../config/environment');
var commerceAdapter = require('./commerce.adapter');
var logger = require('../../config/logger');
var User = require('../user/user.model');
// Testing vars
var quoteId = 0;
var orderId = 0;

var MagentoAPI = require('magento');
var magento = new MagentoAPI(config.commerce.magento);

describe("Commerce methods", function() {

  this.timeout(5000);
/*
  it('category tree', function (done) {
    this.timeout(5000);
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      // use magento
      magento.catalogCategory.tree({}, function (err, res) {
        assert.equal(res.category_id, '1');
        assert.equal(res.name, 'Root Catalog');
        assert.operator(res.children[0].children.length, '>', 0);
        //assert.notEqual(res.children[0].children.length, 0);
        done();
      });
    });
  });

  it('category product list', function (done) {
    this.timeout(5000);
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      // use magento
      magento.catalogCategory.assignedProducts({
        categoryId: config.commerce.category.teams //3
      }, function (err, res) {
        assert.operator(res.length, '>', 0)
        done();
      });
    });
  });

  it('product view', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      // use magento
      magento.catalogProduct.info({
        id: config.commerce.testing.teamId
      }, function (err, res) {
        magento.catalogProductAttributeMedia.list({
          product: config.commerce.testing.teamId
          }, function (err, resimg) {
            res.images = resimg;
            assert.notEqual(res.length, 0);
            assert.equal(res.images[0].file, "/s/c/screen_shot_2014-11-25_at_8.50.53_am.png");
            done();
        });
      });
    });
  });

  it('product view images', function (done) {
    this.timeout(5000);
      magento.login(function (err, sessId) {
        if (err) {
          logger.info(err, err);
          return;
        }
        // use magento
        magento.catalogProductAttributeMedia.list({
          product: config.commerce.testing.teamId//3
        }, function (err, res) {
          assert.notEqual(res.length, 0);
          assert.equal(res[0].file, "/s/c/screen_shot_2014-11-25_at_8.50.53_am.png");
          done();
        });
      });
  });

  it('product view attributes required', function (done) {
    this.timeout(5000);
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      // use magento
      magento.catalogProductCustomOption.list({
      productId: config.commerce.testing.teamId
      }, function (err, res) {
        assert.operator(res.length, '>', 0);
        assert.equal(res[0].title, 'Season');
        assert.equal(res[0].type, 'drop_down');
        assert.equal(res[1].title, 'Years');
        done();
      });
    });
  });

  it('product view attribute options', function (done) {
    this.timeout(5000);
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      // use magento
      magento.catalogProductCustomOptionValue.list({
        optionId: 2
      }, function (err, res) {
        assert.notEqual(res.length, 0);
        assert.equal(res[0].value_id, '7');
        assert.equal(res[0].title, 'Winter 2014-15');
        assert.equal(res[0].price_type, 'fixed');
        done();
      });
    });
  });

  it('category product related list link', function (done) {
    this.timeout(5000);
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      // use magento
      magento.catalogProductLink.list({
        product: config.commerce.testing.teamId,
        type:'related'
      }, function (err, res) {
        assert.operator(res.length,'>',0);
        done();
      });
    });
  });


  it('cart remove', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      magento.checkoutCartProduct.remove({
        quoteId: quoteId,
        productsData: {sku: "TIGERS", qty: "1", options: {"2" : "7", "1" : "3"}}
      }, function (err, res) {
        assert.equal(res, true);
        done();
      });
    });
  });

  //change for update
  it('cart add', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      var shoppingCartProductEntityArray = {
        product_id: 2,
        sku: "TIGERS",
        qty: 1,
        options: {"2" : "7", "1" : "3"},
        bundle_option: [],
        bundle_option_qty: [],
        links: {}
      };
      // use magento
      magento.checkoutCartProduct.add({
        quoteId: quoteId,
        products:   [ shoppingCartProductEntityArray ]
      }, function (err, res) {
        assert.equal(res, true);
        done();
      });
    });
  });

  it('cart totals', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      // use magento
      magento.checkoutCart.totals({
        quoteId: quoteId,
      }, function (err, res) {
        assert.equal(res[0].amount, 400);
        assert.equal(res[1].amount, 400);
        done();
      });
    });
  });

  it('cart line details', function (done) {
    // TODO
    // currently checkoutCartProduct.list does not retrieve the custom options of the products
    done();
  });

  it('checkout set shipping method', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      // use magento
      magento.checkoutCartShipping.method({
        quoteId: quoteId,
        shippingMethod: "freeshipping_freeshipping"
      }, function (err, res) {
        assert.equal(res, true);
        done();
      });
    });
  });

  it('checkout set payment method', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      // use magento
      magento.checkoutCartPayment.method({
        quoteId: quoteId,
        paymentData: {
          po_number: "Order: BP-order-1111111 / Customer: BP-customer-1111112",
          method: "purchaseorder"
        }
      }, function (err, res) {
        assert.equal(res, true);
        done();
      });
    });
  });

  it('checkout place order', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      // use magento
      magento.checkoutCart.order({
        quoteId: quoteId
      }, function (err, res) {
        orderId = res.orderId;
        assert.operator(res, ">",0);
        done();
      });
    });
  });

  it('checkout add comment to order', function (done) {
    var myComment = {data: 123123123, name: "BalancedPayemnts"};
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      magento.salesOrder.addComment({
        orderIncrementId: orderId,
        status: "pending",
        comment: JSON.stringify(myComment)
      }, function (err, res) {
        done();
      });
    });
  });

  it('create order transaction', function (done) {
    this.timeout(5000);

    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      // use magento
      magento.bighippoSales.createTransaction({ orderId: 31, transactionId: "aaa3a5=6", addInfo: {amount:123, test:345}}, function (err, res) {
        assert.isNull(err);
        assert.isNotNull(res);
        assert.isNotNull(res.transactionId);
        done();
      });
    });
  });

  it('cart create', function (done) {
    this.timeout(5000);

    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      // use magento
      magento.checkoutCart.create(function (err, res) {
        //return idCart
        assert.notEqual(res, 0);
        quoteId = res;
        done();
      });
    });
  });

  it('cart add', function (done) {
    this.timeout(5000);
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      var shoppingCartProductEntityArray = {
        product_id: 2,
        sku: "TIGERS",
        qty: 1,
        options: {"2" : "7", "1" : "3"},
        bundle_option: [],
        bundle_option_qty: [],
        links: {}
      };
      // use magento
      magento.checkoutCartProduct.add({
        quoteId: quoteId,
        products:   [ shoppingCartProductEntityArray ]
      }, function (err, res) {
        assert.equal(res, true);
        done();
      });
    });
  });

  it('cart add', function (done) {
    this.timeout(5000);
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      var shoppingCartProductEntityArray = {
        product_id: 9,
        sku: "fee",
        qty: 1
      };
      // use magento
      magento.checkoutCartProduct.add({
        quoteId: quoteId,
        products:   [ shoppingCartProductEntityArray ]
      }, function (err, res) {
        assert.equal(res, true);
        done();
      });
    });
  });

  it('cart list', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      // use magento
      magento.checkoutCartProduct.list({
        quoteId: quoteId,
      }, function (err, res) {
        done();
      });
    });
  });

  it('cart addresses', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      // use magento
      magento.checkoutCartCustomer.addresses({
        quoteId: quoteId,
        customerAddressData:[
          {
            mode: "billing",
            firstname: "Ignacio",
            lastname: "Pascual",
            street: "801 east 11th st",
            address2: "801 east 11th st",
            city: "Austin",
            region: "TX",
            postcode: "78702",
            country_id: "US",
            telephone: "+1 320123245"
          },
          {
            mode: "shipping",
            firstname: "Ignacio",
            lastname: "Pascual",
            street: "801 east 11th st",
            address2: "801 east 11th st",
            city: "Austin",
            region: "TX",
            postcode: "78702",
            country_id: "US",
            telephone: "+1 320123245"
          }
        ]
      }, function (err, res) {
        assert.equal(res, true);
        done();
      });
    });
  });


  it('cart totals', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      // use magento
      magento.checkoutCart.totals({
        quoteId: quoteId,
      }, function (err, res) {
        console.log(res);
        done();
      });
    });
  });

  it('updateCartProductPrice', function (done) {
    this.timeout(5000);

    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      // use magento
      magento.bighippoCheckout.updateCartProductPrice({ quoteId: quoteId, productId: 9, price: 44.911}, function (err, res) {
        console.log(err);
        console.log(res);
        assert.isNull(err);
        assert.isNotNull(res);
        assert.isNotNull(res.transactionId);
        done();
      });
    });
  });

  it('cart list', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      // use magento
      magento.checkoutCartProduct.list({
        quoteId: quoteId,
      }, function (err, res) {
        done();
      });
    });
  });

  it('cart addresses', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      // use magento
      magento.checkoutCartCustomer.addresses({
        quoteId: quoteId,
        customerAddressData:[
          {
            mode: "billing",
            firstname: "Ignacio",
            lastname: "Pascual",
            street: "801 east 11th st",
            address2: "801 east 11th st",
            city: "Austin",
            region: "TX",
            postcode: "78702",
            country_id: "US",
            telephone: "+1 320123245"
          },
          {
            mode: "shipping",
            firstname: "Ignacio",
            lastname: "Pascual",
            street: "801 east 11th st",
            address2: "801 east 11th st",
            city: "Austin",
            region: "TX",
            postcode: "78702",
            country_id: "US",
            telephone: "+1 320123245"
          }
        ]
      }, function (err, res) {
        assert.equal(res, true);
        done();
      });
    });
  });


  it('cart totals', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return;
      }
      // use magento
      magento.checkoutCart.totals({
        quoteId: quoteId,
      }, function (err, res) {
        console.log(res);
        done();
      });
    });
  });

    it('order load', function (done) {
      var orderId = "000000026";

      commerceAdapter.orderLoad(orderId, function(err, data){
        assert.isNull(err);
        assert.isNotNull(data);
        assert.isNotNull(data.sku);
        assert.isNotNull(data.productId);
        assert.isNotNull(data.paymentMethod);
        assert.isNotNull(data.athleteId);
        done();
      });
    });

    it('order list', function (done) {
      this.timeout(5000);
      commerceAdapter.orderList({status: "pending"}, function(err, data){
        assert.isNull(err);
        assert.isNotNull(data);
        assert.operator(data.length, '>', 0);
        done();
      });
    });

 */

  /*
  var customerId;
  var customerAddressId;
  it('create customer', function(done) {
    var user = new User({
      firstName: "Ignacio",
      lastName: "Pascual",
      email: "jesse.cogollo@talosdigital.com",
      gender: "male"
    });
    commerceAdapter.createCustomer(user, function(err, data){
      if(err) return done(err);
      assert.isNotNull(data);
      customerId = data;
      done();
    });
  });

  it('create customer address', function(done) {
    var address = {mode: 'billing-shipping', "firstName":"Ignacio","lastName":"Pascual","address1":"my address my address2","city":"Austin","state":"TX","zipCode":11111,"country":"US","telephone":"1234444555"};

    commerceAdapter.createCustomerAddress(customerId, address, function(err, data){
      if(err) return done(err);
      assert.isNotNull(data);
      customerAddressId = data;
      done();
    });
  });


  it('delete all customer addresses', function(done) {
    //TODO
    // magento.customerAddress.list
    // magento.customerAddress.delete
    done();
  })

  it('merge all customer addresses', function(done) {
    //TODO
    // delete all address
    // create user address on Magento
    done();
  })
*/

  it('list order transactions', function (done) {
    this.timeout(25000);

    commerceAdapter.transactionList(19, function(err,data){
      if(err) return done(err);
      assert.isNotNull(data);
      done();
    });
  });


});

