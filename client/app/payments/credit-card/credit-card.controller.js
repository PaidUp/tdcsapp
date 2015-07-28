'use strict';

angular.module('convenienceApp')
  .controller('CreditCardCtrl', function ($rootScope, $scope, ModalFactory, UserService,
    AuthService, FlashService, CartService, $state, PaymentService,
    ApplicationConfigService, CommerceService, NotificationEmailService) {
    $rootScope.$emit('bar-welcome', {
      left: {
        url: 'app/payments/templates/loan-bar.html'
      },
      right: {
        url: ''
      }
    });
    $scope.card = null;
    $scope.expirationDate = {};
    // $scope.cards = [{cardNumber: 'xxxx5432'},{cardNumber: 'xxxx0987'}];
    $scope.billing = {};
    $scope.modalFactory = ModalFactory;
    $scope.oldBillingAddress = null;
    $scope.oldPhone = null;
    $scope.user = angular.copy(AuthService.getCurrentUser());
    //get schedule

    $scope.sendAlertErrorMsg = function (msg) {
      FlashService.addAlert({
        type: 'danger',
        msg: msg,
        timeout: 10000
      });
    };

    $scope.schedules = [];

    var currentCartId = CartService.getCurrentCartId();
    CartService.getCart(currentCartId).then(function (value) {
      var products = value.items;
      products.forEach(function (ele, idx, arr) {
        CartService.hasProductBySKU('PMINFULL', function (isInFullPay) {
          CommerceService.getSchedule(ele.productId, ele.price, isInFullPay).then(function (val) {
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
    });

    ApplicationConfigService.getConfig().then(function (config) {
      Stripe.setPublishableKey(config.stripeApiPublic);
      balanced.init('/v1/marketplaces/' + config.marketplace);
    });

    PaymentService.listCards().then(function (response) {
      $scope.cards = angular.copy(response.data);
      angular.forEach($scope.cards, function (card) {
        card.nameOnCard = card.name;
        card.cardNumber = card.last4;
        card.expirationDate = {};
        card.expirationDate.month = card.expirationMonth;
        card.expirationDate.year = card.expirationYear;
        card.securityCode = card.cvv;
        card.token = card.id;
        card.brand = card.brand + ' ending in ';
      });
      $scope.cards.push({ cardNumber: 'Create a new credit card' });
      if ($scope.cards.length === 1) {
        $scope.createCard = true;
      }
    }).catch(function (err) {
      $scope.sendAlertErrorMsg(err.data.message);
    });

    $scope.changeCard = function () {
      if ($scope.cardDetails.cardNumber === 'Create a new credit card') {
        $scope.card = null;
        $scope.createCard = true;
      } else {
        $scope.createCard = false;
        $scope.card = angular.copy($scope.cardDetails);
      }
    };

    $scope.states = UserService.getStates();
    $scope.user = AuthService.getCurrentUser();

    $scope.sendAlertErrorMsg = function (msg) {
      FlashService.addAlert({
        type: 'danger',
        msg: msg,
        timeout: 10000
      });
    };

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

    $scope.validateInput = function () {
      if ($scope.card && $scope.card.cardNumber && balanced.card.isCardNumberValid($scope.card.cardNumber)) {
        $scope.checkoutForm.cardNumber.$setValidity('format', true);
      } else {
        $scope.checkoutForm.cardNumber.$setValidity('format', false);
      }

      if ($scope.card && $scope.card.expirationDate && $scope.card.expirationDate.month &&
        $scope.card.expirationDate.year &&
        balanced.card.isExpiryValid($scope.card.expirationDate.month, $scope.card.expirationDate.year)) {
        $scope.checkoutForm.$setValidity('expiration', true);
      } else {
        $scope.checkoutForm.$setValidity('expiration', false);
      }
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

    // $scope.changeCreditCard = function () {
    //   if ($scope.card === 'create') {

    //   }
    // };

    $scope.placeOrder = function (isValid) {
      if (!isValid) {
        $scope.sendAlertErrorMsg('Please check form fields');
        $scope.placedOrder = false;

      }
      $scope.submitted = true;
      $scope.placedOrder = true;
      if ($scope.createCard) {
        $scope.validateInput();
      }
      if ($scope.checkoutForm.$valid) {
        if ($scope.createCard) {
          var payload = {
            number: $scope.card.cardNumber,
            name: $scope.card.nameOnCard,
            cvc: $scope.card.securityCode,
            exp_month: $scope.card.expirationDate.month,
            exp_year: $scope.card.expirationDate.year
          };
          Stripe.card.createToken(payload, function stripeResponseHandler(status, response) {
            if (response.error) {
              $scope.placedOrder = false;
              if (response.error && response.error.message) {
                $scope.sendAlertErrorMsg(response.error.message);
              } else if (Object.keys(response.error).length !== 0) {
                for (var key in response.error) {
                  $scope.sendAlertErrorMsg(response.error[key]);
                }
              } else {
                $scope.sendAlertErrorMsg('Failed to Billing you, check your information');
              }
            }
            else {

              PaymentService.associateCard(response.id).then(function (newCard) {

                // Send to your backend
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

                var isInFullPay = null;
                var price = null;

                CartService.getCart(currentCartId).then(function (value) {
                  var products = value.items;
                  products.forEach(function (ele, idx, arr) {
                    CartService.hasProductBySKU('PMINFULL', function (isInFullP) {
                      isInFullPay = isInFullP;
                      price = ele.price;

                      var payment = {
                        cartId: CartService.getCurrentCartId(),
                        athleteFirstName: CartService.getAthlete().firstName,
                        athleteLastName: CartService.getAthlete().lastName,
                        addresses: [
                          addressBilling,
                          addressShipping
                        ],
                        cardId: newCard.id,
                        userId: CartService.getUserId(),
                        payment: 'onetime',
                        paymentMethod: 'creditcard',
                        isInFullPay: isInFullPay,
                        price: price
                      };
                      PaymentService.sendPayment(payment).then(function () {
                        CartService.removeCurrentCart();
                        CartService.createCart();
                        $scope.saveOrUpdateBillingAddress();
                        $state.go('thank-you');
                      }).catch(function (err) {
                        if (err.data) {
                          $scope.sendAlertErrorMsg(err.data.message);
                        }
                      });
                    }).catch(function (err) {
                      $scope.placedOrder = false;
                      for (var key in response.error) {
                        $scope.sendAlertErrorMsg(response.error[key]);
                      }
                    });


                  });
                });
              });
            }
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

          var isInFullPay = null;
          var price = null;

          CartService.getCart(currentCartId).then(function (value) {
            var products = value.items;
            products.forEach(function (ele, idx, arr) {
              CartService.hasProductBySKU('PMINFULL', function (isInFullP) {
                isInFullPay = isInFullP;
                price = ele.price;

                var payment = {
                  cartId: CartService.getCurrentCartId(),
                  addresses: [
                    addressBilling,
                    addressShipping
                  ],
                  cardId: $scope.card.token,
                  userId: CartService.getUserId(),
                  athleteFirstName: CartService.getAthlete().firstName,
                  athleteLastName: CartService.getAthlete().lastName,
                  payment: 'onetime',
                  paymentMethod: 'creditcard',
                  isInFullPay: isInFullPay,
                  price: price
                };
                PaymentService.sendPayment(payment).then(function () {
                  CartService.removeCurrentCart();
                  $scope.saveOrUpdateBillingAddress();
                  $state.go('thank-you');
                }).catch(function (err) {
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
    $scope.fieldNumberOnly = function (modelField) {
      if (!isNaN(modelField)) {
        $scope.$parent.card[modelField] = '';
      }
    }
  });
