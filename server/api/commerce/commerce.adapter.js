var config = require('../../config/environment');
var MagentoAPI = require('magento');
var magento = new MagentoAPI(config.commerce.magento);
var camelize = require('camelize');
var snakeize = require('snakeize');
var userService = require('../user/user.service');

exports.teamsList = function(res){
  magento.login(function (err, sessId) {
      if (err) {
        return res(err);
      }
      magento.catalogCategory.assignedProducts({
        categoryId: config.commerce.category.teams
      }, function (err, resTeams) {
        if(err) return res(err);
        return res(null,camelize(resTeams));
      });
    });
}
//Catalog
exports.catalogProductInfo = function(id, res){
  magento.login(function (err, sessId) {
        if(err) return res(err);
        magento.catalogProduct.info({
          id: id
        }, function (err, resinfo) {
          if(err) return res(err);
      return res(null,camelize(resinfo));
        });
    });
}

exports.catalogProductAttributeMediaList = function(id, res){
  magento.login(function (err, sessId) {
        if(err) return res(err);
        magento.catalogProductAttributeMedia.list({
          product: id
      }, function (err, resImg) {
        if(err) return res(err);
        return res(null,camelize(resImg));
      });
    });
}

exports.catalogProductCustomOption = function(id, res){
  magento.login(function (err, sessId) {
      if(err) return res(err);
      magento.catalogProductCustomOption.list({
      productId: id
    }, function (err, resCustomOption) {
      if(err) return res(err);
      return res(null,camelize(resCustomOption));
    });
  });
}

exports.catalogProductCustomOptionValue = function(id, res){
  magento.login(function (err, sessId) {
      if(err) return res(err);
    magento.catalogProductCustomOptionValue.list({
      optionId: id
    }, function (err, resCustomOptionValue) {
      if(err) return res(err);
      return res(null,camelize(resCustomOptionValue));
    });
  });
}

exports.catalogProductLink = function(teamId, res){
  magento.login(function (err, sessId) {
      if(err) return res(err);
    magento.catalogProductLink.list({
      product: teamId,
          type:'related'
    }, function (err, resProductLink) {
      if(err) return res(err);
      return res(null,camelize(resProductLink));
    });
  });
}
//end Catalog

//Cart
exports.cartCreate = function(res){
  magento.login(function (err, sessId) {
      if(err) return res(err);
    magento.checkoutCart.create(function (err, resCartCreate) {
      if(err) return res(err);
      return res(null,camelize(resCartCreate));
    });
  });
}

exports.cartAdd = function(shoppingCartProductEntity,res){
  magento.login(function (err, sessId) {
      if(err) return res(err);
    magento.checkoutCartProduct.add({
      quoteId: shoppingCartProductEntity.cartId,
          products:  snakeize(shoppingCartProductEntity.products)//Array []
    }, function (err, resChkCartProduct) {
      if(err) return res(err);
      return res(null,camelize(resChkCartProduct));
    });
  });
}

exports.cartRemove = function(shoppingCartProductEntity,res){
  magento.login(function (err, sessId) {
      if(err) return res(err);
    magento.checkoutCartProduct.remove({
      quoteId: snakeize(shoppingCartProductEntity.cartId),
          productsData: snakeize(shoppingCartProductEntity.products)//Array []
    }, function (err, resChkCartProduct) {
      if(err) return res(err);
      return res(null,camelize(resChkCartProduct));
    });
  });
}

exports.cartList = function(cartId,res){
  magento.login(function (err, sessId) {
      if(err) return res(err);
    magento.checkoutCartProduct.list({
      quoteId: cartId
    }, function (err, resChkCartProductList) {
      if(err) return res(err);
      return res(null,camelize(resChkCartProductList));
    });
  });
}

exports.cartAddress = function(cartId, customerAddressData,res){
  var addresses = exports.mapMagentoAddresses(customerAddressData);
  magento.login(function (err, sessId) {
      if(err) return res(err);
    magento.checkoutCartCustomer.addresses({
      quoteId: cartId,
      customerAddressData: addresses
    }, function (err, resChkCartAddress) {
      if(err) return res(err);
      return res(null,camelize(resChkCartAddress));
    });
  });
}

exports.cartCustomer = function(cartId, customer, res){
  var customerData = {customer_id: customer.mageCustomerId, mode:"customer", firstname: customer.firstName, lastname: customer.lastName, email: customer.email};
  magento.login(function (err, sessId) {
    if(err) return res(err);
    magento.checkoutCartCustomer.set({
      quoteId: cartId,
      customerData: customerData
    }, function (err, resChkCartAddress) {
      if(err) return res(err);
      return res(null,camelize(resChkCartAddress));
    });
  });
}

/**
 * Prepare user for Magento
 * @param user
 * @param cb
 */
exports.prepareCustomer = function(user, cb) {
  if(! user.mageCustomerId) {
    createCustomer(user, function(err, magentoId) {
      if (err) return cb(err);
      user.mageCustomerId = magentoId;
      userService.save(user,function(err, user){
        if (err) return cb(err);
        return cb(null, user);
      });
    });
  }
  else {
    return cb(null, user);
  }
}

createCustomer = exports.createCustomer = function(user, cb) {
  // Map to magento
  var gender = 1;
  if(user.gender === 'female') {
    gender = 2;
  }
  magento.login(function (err, sessId) {
    if(err) return cb(err);
    magento.customer.create({
      customerData: { firstname: user.firstName, lastname: user.lastName, "email" : user.email, gender: gender}
    }, function(err, data){
      if(err) return cb(err);
      return cb(null, data);
    });
  });
};

createCustomerAddress = exports.createCustomerAddress = function(mageCustomerId, address, cb) {
  var mageAddress = mapMagentoAddress(address);
  magento.login(function (err, sessId) {
    if(err) return res(err);
    magento.customerAddress.create({
      customerId: mageCustomerId,
      addressData: mageAddress
    }, function(err, addressId){
      if(err) return cb(err);
      return cb(null, addressId);
    });
  });
};


exports.cartView = function(quoteId,res){
  magento.login(function (err, sessId) {
      if(err) return res(err);
    magento.checkoutCart.info({
      quoteId: quoteId
    }, function (err, resChkCartView) {
      if(err) return res(err);
      return res(null,camelize(resChkCartView));
    });
  });
}

exports.cartTotals = function(quoteId,res){
  magento.login(function (err, sessId) {
      if(err) return res(err);
    magento.checkoutCart.totals({
      quoteId: quoteId
    }, function (err, resChkCartTotals) {
      if(err) return res(err);
      return res(null,camelize(resChkCartTotals));
    });
  });
}
//end Cart

//Checkout
exports.setShipping = function(cartId, res){
  magento.login(function (err, sessId) {
      if(err) return res(err);
    magento.checkoutCartShipping.method({
      quoteId: cartId,
      shippingMethod: config.commerce.shippingMethod
    }, function (err, resSetShipping) {
      if(err) return res(err);
      return res(null,resSetShipping);
    });
  });
}

exports.setPayment = function(cartId, poNumber, res){
  magento.login(function (err, sessId) {
    if(err) return res(err);
    magento.checkoutCartPayment.method({
      quoteId: cartId,
          paymentData: {
              method: config.commerce.paymentMethod,
              po_number: poNumber
          }
    }, function (err, resSetPayment) {
      if(err) return res(err);
      return res(null,camelize(resSetPayment));
    });
  });
}

exports.placeOrder = function(quoteId, res){
  magento.login(function (err, sessId) {
    if(err) return res(err);
    magento.checkoutCart.order({
      quoteId: quoteId
    }, function (err, resOrderId) {
      if(err) return res(err);
      return res(null,resOrderId);
    });
  });
}

exports.orderHold = function(orderId, res){
  magento.login(function (err, sessId) {
    if(err) return res(err);
    magento.salesOrder.hold({
      orderIncrementId: orderId
    }, function (err, resOrderId) {
      if(err) return res(err);
      return res(null,resOrderId);
    });
  });
}


exports.mapMagentoAddresses = function (address){
  arrAddress = [];
  for(var i=0;i<address.length;i++){
    arrAddress.push(mapMagentoAddress(address[i]));
  }
  return arrAddress;
}

mapMagentoAddress = exports.mapMagentoAddress = function (address) {
  var addressObj = {};
  addressObj.mode = address.mode;
  if(address.mode == "billing") {
    addressObj.is_default_billing = true;
  }
  if(address.mode == "shipping") {
    addressObj.is_default_shipping = true;
  }
  if(address.mode == "billing-shipping") {
    addressObj.is_default_billing = true;
    addressObj.is_default_shipping = true;
  }
  addressObj.firstname = address.firstName;
  addressObj.lastname = address.lastName;
  addressObj.street = address.address1;
  if(address.address2) {
    addressObj.street = address.address1 + ' ' + address.address2;
  }
  addressObj.city = address.city;
  addressObj.region = address.state;
  addressObj.postcode = address.zipCode;
  addressObj.country_id = address.country;
  addressObj.telephone = address.telephone;

  return addressObj;
}

exports.addCommentToOrder = function(orderId, comment, status, cb) {
  magento.login(function (err, sessId) {
    if (err) {
      return;
    }
    if(! status) {
      status = 'pending'
    }
    magento.salesOrder.addComment({
      orderIncrementId: orderId,
      status: status,
      comment: comment
    }, function (err, res) {
      return cb(err, res);
    });
  });
}

exports.addTransactionToOrder = function(orderId, transactionId, addInfo, cb) {
  magento.login(function (err, sessId) {
    if (err) {
      return;
    }
    magento.bighippoSales.createTransaction({
      orderId: orderId,
      transactionId: transactionId,
      addInfo: addInfo
    }, function (err, res) {
      return cb(err, res);
    });
  });
}

exports.updateCartProductPrice = function(cartId, productId, price, cb) {
  magento.login(function (err, sessId) {
    if (err) {
      return;
    }
    var data ={
      quoteId: cartId,
      productId: productId,
      price: price
    };
    magento.bighippoCheckout.updateCartProductPrice({
      quoteId: cartId,
      productId: productId,
      price: price
    }, function (err, res) {
      return cb(err, res);
    });
  });
}

exports.orderLoad = function(orderId, cb) {
  magento.login(function (err, sessId) {
    if (err) {
      logger.info(err, err);
      return cb(err);
    }
    magento.salesOrder.info({
      orderIncrementId: orderId
    }, function (err, res) {
      if(err) return cb(err);
      var orderDetails = mapOrder(res);
      return cb(null, orderDetails);
    });
  });
}

exports.orderList = function(filters, cb) {
  var orders = [];
  magento.login(function (err, sessId) {
    if (err) {
      logger.info(err, err);
      return cb(err);
    }
    magento.salesOrder.list({
      filters : filters
    }, function (err, res) {
      if(err) return cb(err);
      for(var orderIndex in res) {
        var order = res[orderIndex];
        orders.push(mapOrder(order));
      }
      return cb(null, orders);
    });
  });
}

exports.transactionList = function(orderId, cb) {
  magento.login(function (err, sessId) {
    if(err) return res(err);
    magento.bighippoSales.listTransactions({
      orderId: orderId
    }, function (err, data) {
      if(err) return cb(err);
      return cb(null,camelize(data));
    });
  });
}

function mapOrder(magentoOrder) {
  var orderDetails = {};
  orderDetails.incrementId = magentoOrder.increment_id;
  orderDetails.status = magentoOrder.status;
  orderDetails.grandTotal = magentoOrder.grand_total;
  if(magentoOrder.items) {
    orderDetails.sku = magentoOrder.items[0].sku;
    orderDetails.productId = magentoOrder.items[0].product_id;
  }
  for(var commentId in magentoOrder.status_history) {
    try {
      if(magentoOrder.status_history[commentId]) {
        var comment = magentoOrder.status_history[commentId].comment;
        var json = JSON.parse(comment);
        if(json.userId) {
          orderDetails.userId = json.userId;
          orderDetails.paymentMethod = json.paymentMethod;
          orderDetails.payment = json.payment;
          orderDetails.athleteId = json.athleteId;
          orderDetails.products = json.products;
          orderDetails.createdAt = magentoOrder.status_history[commentId].created_at;
          if (json.cardId) {
            orderDetails.cardId = json.cardId;
          }
        }
      }
    } catch (e) {
    }
  }
  return orderDetails;
}

