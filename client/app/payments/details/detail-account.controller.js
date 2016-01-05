'use strict';

angular.module('convenienceApp')
  .controller('DetailAccountCtrl', function ($rootScope, $scope, ModalFactory, UserService, AuthService, FlashService,
                                           CartService, $state, PaymentService, ApplicationConfigService, CommerceService,
                                           NotificationEmailService, TrackerService, $q) {
    $rootScope.$emit('bar-welcome', {
      left: {
        url: ''//'app/payments/templates/loan-bar.html'
      },
      right: {
        url: ''
      }
    });

    $rootScope.$emit('init-cart-service' , {});

    $scope.account = null;
    $scope.billing = {};
    $scope.modalFactory = ModalFactory;
    $scope.oldBillingAddress = null;
    $scope.oldPhone = null;
    $scope.user = angular.copy(AuthService.getCurrentUser());
    $scope.states = UserService.getStates();
    $scope.accounts = [];
    //get schedule

    $scope.createBank = false;
    $scope.createCard = false;

    $scope.submitted = false;

    $scope.submittedFunc = function(){
      $scope.submitted = true;
    };

    $scope.sendAlertErrorMsg = function (msg) {
      $scope.placedOrder = false;
      FlashService.addAlert({
        type: 'danger',
        msg: msg,
        timeout: 10000
      });
    };

    $scope.schedules = [];

    var currentCartId = CartService.getCurrentCartId();

    $scope.limitMinList = 1;

    function init(){
      $scope.placedOrder = true;
      setKey();
      getCart();
      fillFormUserDetails();

      loadBankAccounts($scope.accounts).then(function(lst){
        loadCreditCardAccounts(lst).then(function(lst2){
          $scope.accounts.push({ accountName: 'Create a new credit card' });
          //$scope.accounts.push({ accountName : 'Create a new bank account' , last4: '' });
          $scope.placedOrder = false;
        }, function(err2){
          $scope.sendAlertErrorMsg(err.data.message);
        });
        }, function(err){
          $scope.sendAlertErrorMsg(err.data.message);
      });
    };

    function getCart(){
      CartService.getCart(currentCartId).then(function (value) {
        var ele = value.items[0];

        CartService.hasProductBySKU('PMINFULL', function (isInFullPay) {
          CommerceService.getSchedule(ele.productId, CartService.getCartGrandTotal() , isInFullPay, CartService.getCartDiscount()).then(function (val) {
            if(val.error){
              var user = AuthService.getCurrentUser;
              $scope.isScheduleError = true;
              NotificationEmailService.sendNotificationEmail('Get schedule error', {
                productId:ele.productId,
                price:ele.price,
                isInFullPay: isInFullPay,
                email: user.email
              });
            }
            $scope.schedules.push({
              name: ele.name,
              periods: val.schedulePeriods
            });
          });
        });
      });
    }

    function setKey(){
      ApplicationConfigService.getConfig().then(function (config) {
        Stripe.setPublishableKey(config.stripeApiPublic);
      });
    }

    function loadBankAccounts(lstAccount){
      return $q(function(resolve, reject){
        setTimeout(function(){
          PaymentService.listBankAccounts().then(function (response) {
            response.data.forEach(function(ele, idx, arr){
              ele.accountName = ele.bankName + ' ending in ';
              lstAccount.push(ele)
            });
            resolve(lstAccount);
          }).catch(function (err) {
            reject(err.data.message);
          });
        }, 1000);
      });
    };

    function loadCreditCardAccounts(lstAccount){
      return $q(function(resolve, reject){
        setTimeout(function(){
          PaymentService.listCards().then(function (response) {
            response.data.forEach(function(card, idx, arr){
              card.nameOnCard = card.name;
              card.cardNumber = card.last4;
              card.expirationDate = {};
              card.expirationDate.month = card.expirationMonth;
              card.expirationDate.year = card.expirationYear;
              card.securityCode = card.cvv;
              card.token = card.id;
              card.accountName = card.brand + ' ending in ';
              lstAccount.push(card)
            });
            resolve(lstAccount);
          }).catch(function (err) {
            reject(err.data.message)
          });

        }, 1000);
      });
    }

    $scope.changeAccount = function () {
      if ($scope.accountDetails.accountName && $scope.accountDetails.accountName === 'Create a new bank account') {
        $scope.account = null;
        $scope.createBank = true;
        $scope.createCard = false;
      } else if($scope.accountDetails.accountName && $scope.accountDetails.accountName === 'Create a new credit card'){
        $scope.account = null;
        $scope.createBank = false;
        $scope.createCard = true;
      } else {
        $scope.createBank = false;
        $scope.createCard = false;
        $scope.account = angular.copy($scope.accountDetails);
      }
    };

  function fillFormUserDetails(){
    AuthService.isLoggedInAsync(function (loggedIn) {
      UserService.listAddresses($scope.user._id).then(function (data) {
        angular.forEach(data, function (address) {
          UserService.getAddress($scope.user._id, address.addressId).then(function (addressObj) {
            if (addressObj.type === 'billing') {
              $scope.oldBillingAddress = addressObj;
              $scope.billing.address = angular.extend({}, addressObj);
            }
          }).catch(function (err) {
            $scope.sendAlertErrorMsg(err.data.message);
          });
        });
      }).catch(function (err) {
        $scope.sendAlertErrorMsg(err.data.message);
      });

      UserService.getContactList($scope.user._id).then(function (data) {
        angular.forEach(data, function (contactInfo) {
          UserService.getContact($scope.user._id, contactInfo.contactId).then(function (contact) {
            if (contact.label === 'shipping') {
              $scope.oldPhone = contact;
              $scope.billing.phone = contact.value;
            }
          }).catch(function (err) {
            $scope.sendAlertErrorMsg(err.data.message);
          });
        });
      }).catch(function (err) {
        $scope.sendAlertErrorMsg(err.data.message);
      });
    });
  };

    $scope.updateAddress = function (address) {
      UserService.updateAddress(address.addressId, address, $scope.user._id).then(function (data) {
        address.addressId = data.addressId;
        // $scope.sendAlertUpdateProfileSuccess();
      }).catch(function (err) {
        $scope.sendAlertErrorMsg(err.data.message);
      });
    };

    $scope.createAddress = function (address) {
      UserService.createAddress(address).then(function (data) {
        address.addressId = data.addressId;
        // $scope.sendAlertUpdateProfileSuccess();
      }).catch(function (err) {
        $scope.sendAlertErrorMsg(err.data.message);
      });
    };

    $scope.createInfoPhone = function (phone, label) {
      var phoneInfo = {
        label: label,
        type: 'telephone',
        value: phone,
        userId: $scope.user._id
      };

      UserService.createContact(phoneInfo).then(function (data) {
        phoneInfo.contactId = data.contactId;
        // $scope.sendAlertUpdateProfileSuccess();
      }).catch(function (err) {
        $scope.sendAlertErrorMsg(err.data.message);
      });
    };

    $scope.updateInfoPhone = function (phoneInfo) {
      UserService.contactUpdate(phoneInfo, $scope.user._id).then(function (data) {
        phoneInfo.contactId = data.contactId;
        // $scope.sendAlertUpdateProfileSuccess();
      }).catch(function (err) {
        $scope.sendAlertErrorMsg(err.data.message);
      });
    };

    $scope.saveOrUpdateBillingAddress = function () {
      if ($scope.oldPhone && $scope.oldPhone.value !== $scope.billing.phone) {
        // update phone
        $scope.oldPhone.value = $scope.billing.phone;
        $scope.oldPhone.userId = $scope.user._id;
        $scope.updateInfoPhone($scope.oldPhone);
      } else if (!$scope.oldPhone) {
        // create phone
        $scope.createInfoPhone($scope.billing.phone, 'shipping');
      }

      if ($scope.oldBillingAddress) {
        // update billing address
        if ($scope.checkoutForm.address1.$dirty || $scope.checkoutForm.address2.$dirty ||
          $scope.checkoutForm.city.$dirty || $scope.checkoutForm.state.$dirty ||
          $scope.checkoutForm.zipCode.$dirty) {
          $scope.billing.address.userId = $scope.user._id;
          $scope.oldBillingAddress = angular.extend({}, $scope.billing.address);
          $scope.updateAddress($scope.oldBillingAddress);
        }
      } else {
        // create billing address
        $scope.billing.address.type = 'billing';
        $scope.billing.address.label = 'billing';
        $scope.billing.address.country = 'USA';
        $scope.billing.address.userId = $scope.user._id;
        $scope.createAddress($scope.billing.address);
      }
    };

    $scope.placeOrder = function (typeAccount, accountResponse) {

      $scope.submitted = true;
      $scope.placedOrder = true;

      if(!typeAccount && $scope.accountDetails){
        typeAccount = $scope.accountDetails.object;
      }

      TrackerService.trackFormErrors('place order form' , $scope.checkoutForm);
      if (!$scope.checkoutForm.$valid) {
        $scope.sendAlertErrorMsg('Hey, you left some fields blank. Please fill them out.');
        $scope.placedOrder = false;
      }

      var paymentType = 'onetime';
      var paymentMethod = typeAccount === 'bank_account' ? 'directdebit' : 'creditcard'

      if ($scope.checkoutForm.$valid) {
        if (accountResponse) {

          var status = accountResponse.status ? accountResponse.status : 'card';

          var addressBilling = {
            mode: 'billing',
            firstName: $scope.user.firstName,
            lastName: $scope.user.lastName,
            address1: $scope.billing.address.address1,
            address2: $scope.billing.address.address2,
            city: $scope.billing.address.city,
            state: $scope.billing.address.state,
            zipCode: $scope.billing.address.zipCode,
            country: 'US',
            telephone: $scope.billing.phone
          };
          var addressShipping = angular.extend({}, addressBilling);
          addressShipping.mode = 'shipping';

          CartService.getCart(currentCartId).then(function (value) {
            var ele = value.items[0];
            CartService.hasProductBySKU('PMINFULL', function (isInFullPay) {
              var payment = {
                cartId: CartService.getCurrentCartId(),
                athleteFirstName: CartService.getAthlete().firstName,
                athleteLastName: CartService.getAthlete().lastName,
                addresses: [
                  addressBilling,
                  addressShipping
                ],
                cardId: accountResponse.id,
                userId: CartService.getUserId(),
                payment: paymentType,
                paymentMethod: paymentMethod,
                isInFullPay: isInFullPay,
                price: CartService.getCartGrandTotal(),
                discount : CartService.getCartDiscount()
              };

              PaymentService.sendPayment(payment).then(function () {
                CartService.removeCurrentCart();
                CartService.createCart();
                $scope.saveOrUpdateBillingAddress();
                $state.go('thank-you',{status:status});
              }).catch(function (err) {
                if (err.data) {
                  $scope.sendAlertErrorMsg(err.data.message);
                  TrackerService.create('Place order send payment error' , err.data.message);
                }
              });
            },function (err) {
              $scope.placedOrder = false;
              for (var key in response.error) {
                $scope.sendAlertErrorMsg(response.error[key]);
                TrackerService.create('Place order send payment error' , response.error[key]);
              }
            });
          });

        } else {
          var status = $scope.accountDetails.status ? $scope.accountDetails.status : 'card';

          var addressBilling = {
            mode: 'billing',
            firstName: $scope.user.firstName,
            lastName: $scope.user.lastName,
            address1: $scope.billing.address.address1,
            address2: $scope.billing.address.address2,
            city: $scope.billing.address.city,
            state: $scope.billing.address.state,
            zipCode: $scope.billing.address.zipCode,
            country: 'US',
            telephone: $scope.billing.phone
          };
          var addressShipping = angular.extend({}, addressBilling);
          addressShipping.mode = 'shipping';

          CartService.getCart(currentCartId).then(function (value) {
            var products = value.items;
            products.forEach(function (ele, idx, arr) {
              CartService.hasProductBySKU('PMINFULL', function (isInFullPay) {
                var payment = {
                  cartId: CartService.getCurrentCartId(),
                  addresses: [
                    addressBilling,
                    addressShipping
                  ],
                  cardId: $scope.accountDetails.id,
                  userId: CartService.getUserId(),
                  athleteFirstName: CartService.getAthlete().firstName,
                  athleteLastName: CartService.getAthlete().lastName,
                  payment: paymentType,
                  paymentMethod: paymentMethod,
                  isInFullPay: isInFullPay,
                  price: CartService.getCartGrandTotal(),
                  discount : CartService.getCartDiscount()
                };
                PaymentService.sendPayment(payment).then(function () {

                  CartService.removeCurrentCart();
                  $scope.saveOrUpdateBillingAddress();
                  $state.go('thank-you', {'status' : status});
                  TrackerService.create('Place Order');
                }).catch(function (err) {
                  TrackerService.create('Place Order Error', err.message);
                  $scope.sendAlertErrorMsg(err);
                });
              });
            });
          });
        }
      } else {
        $scope.placedOrder = false;
      }
    };

    init();

  });
