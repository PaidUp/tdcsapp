'use strict';

angular.module('convenienceApp')
  .controller('BankAccountCtrl', function ($rootScope, $scope, ModalFactory, UserService, AuthService, FlashService,
                                           CartService, $state, PaymentService, ApplicationConfigService, CommerceService,
                                           NotificationEmailService, TrackerService) {
    $rootScope.$emit('bar-welcome', {
      left: {
        url: 'app/payments/templates/loan-bar.html'
      },
      right: {
        url: ''
      }
    });

    $rootScope.$emit('init-cart-service' , {});

    $scope.bank = null;
    $scope.expirationDate = {};
    // $scope.cards = [{cardNumber: 'xxxx5432'},{cardNumber: 'xxxx0987'}];
    $scope.billing = {};
    $scope.modalFactory = ModalFactory;
    $scope.oldBillingAddress = null;
    $scope.oldPhone = null;
    $scope.user = angular.copy(AuthService.getCurrentUser());
    //get schedule

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

    ApplicationConfigService.getConfig().then(function (config) {
      Stripe.setPublishableKey(config.stripeApiPublic);
    });

    PaymentService.listBankAccounts().then(function (response) {
      $scope.banks = angular.copy(response.data);

      $scope.banks.push({ bankName : 'Create a new bank account' , last4: '' });
      if ($scope.banks.length === 1) {
        $scope.createBank = true;
      }else{
        $scope.createBank = false;
      }
    }).catch(function (err) {
      $scope.sendAlertErrorMsg(err.data.message);
    });

    $scope.changeBank = function () {
      if ($scope.bankDetails.bankName === 'Create a new bank account') {
        $scope.bank = null;
        $scope.createBank = true;
      } else {
        $scope.createBank = false;
        $scope.bank = angular.copy($scope.bankDetails);
      }
    };

    $scope.states = UserService.getStates();
    $scope.user = AuthService.getCurrentUser();
    

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

    $scope.placeOrder = function (bankResponse) {
      TrackerService.trackFormErrors('place order form' , $scope.checkoutForm);
      if (!$scope.checkoutForm.$valid) {
        $scope.sendAlertErrorMsg('Hey, you left some fields blank. Please fill them out.');
        $scope.placedOrder = false;

      }
      $scope.submitted = true;
      $scope.placedOrder = true;

      if ($scope.checkoutForm.$valid) {
        if (bankResponse) {

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
                cardId: bankResponse.id,
                userId: CartService.getUserId(),
                payment: 'onetime',
                paymentMethod: 'directdebit',
                isInFullPay: isInFullPay,
                price: CartService.getCartGrandTotal(),
                discount : CartService.getCartDiscount()
              };
              PaymentService.sendPayment(payment).then(function () {
                CartService.removeCurrentCart();
                CartService.createCart();
                $scope.saveOrUpdateBillingAddress();
                $state.go('thank-you',{status:bankResponse.status});
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
                  cardId: $scope.bankDetails.id,
                  userId: CartService.getUserId(),
                  athleteFirstName: CartService.getAthlete().firstName,
                  athleteLastName: CartService.getAthlete().lastName,
                  payment: 'onetime',
                  paymentMethod: 'directdebit',
                  isInFullPay: isInFullPay,
                  price: CartService.getCartGrandTotal(),
                  discount : CartService.getCartDiscount()
                };
                PaymentService.sendPayment(payment).then(function () {

                  CartService.removeCurrentCart();
                  $scope.saveOrUpdateBillingAddress();
                  $state.go('thank-you', {'status' : $scope.bankDetails.status});
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

  });
