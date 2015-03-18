'use strict';
var config = require('../../../config/environment');
var TDCommerceService = require('TDCore').commerceService;
TDCommerceService.init(config.connections.commerce);

function cartCreate(cb) {
  TDCommerceService.cartCreate(function (err, cartId){
    if(err) return cb(err);
    TDCommerceService.cartAddress(cartId, config.commerce.defaultAddress,function(err, dataAdress) {
      if(err) {return cb(err);}
    });
    return cb(null, cartId);
  });
}

function cartList(cartId,cb) {
  TDCommerceService.cartList(cartId, function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}

function cartAdd(shoppingCartProductEntity, cb) {
  TDCommerceService.cartAdd(shoppingCartProductEntity,function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}

function cartRemove(shoppingCartProductEntity,cb) {
  TDCommerceService.cartRemove(shoppingCartProductEntity,function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}

function cartAddress(shoppingCartAddressEntity,cb) {
  TDCommerceService.cartAddress(shoppingCartAddressEntity,function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}

function cartView(shoppingCartId,cb) {
  TDCommerceService.cartView(shoppingCartId,function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

function cartTotals(shoppingCartId,cb) {
  TDCommerceService.cartTotals(shoppingCartId,function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

function prepareMerchantProducts(shoppingCart, cb) {
  var products = [];

  // TODO
  // check on every product if it has a different Merchant (provider or BPMerchantId)

  var product = shoppingCart.items[1];
  TDCommerceService.catalogProductInfo(product.productId, function(err, data){
    products.push({
      productId : data.productId,
      productSku: data.sku,
      productPurchaseSku: product.sku,
      BPCustomerId: data.balancedCustomerId
    });
    return cb(null, products);
  });
}

exports.addLoanInterest = function(cartId, amount, cb){
  var shoppingCartProductEntityArray = {
    cartId : cartId,
    products : [{
      product_id: config.commerce.products.interest.id,
      sku: config.commerce.products.interest.sku,
      qty: 1
    }]
  };
  TDCommerceService.cartAdd(shoppingCartProductEntityArray, function(err, data) {
    if(err) return cb(err);
    TDCommerceService.updateCartProductPrice(cartId, config.commerce.products.interest.id, amount, function(err, data) {
      if(err) return cb(err);
      return cb(null, data);
    })
  });
}

exports.addFee = function(cartId, cb){
  var shoppingCartProductEntityArray = {
    cartId : cartId,
    products : [{
      product_id: config.commerce.products.fee.id,
      sku: config.commerce.products.fee.sku,
      qty: 1
    }]
  };
  TDCommerceService.cartAdd(shoppingCartProductEntityArray, function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.cartCreate = cartCreate;
exports.cartList = cartList;
exports.cartAdd = cartAdd;
exports.cartRemove = cartRemove;
exports.cartAddress = cartAddress;
exports.cartView = cartView;
exports.cartTotals = cartTotals;
exports.prepareMerchantProducts = prepareMerchantProducts;
