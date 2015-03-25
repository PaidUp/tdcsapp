'use strict';

angular.module('convenienceApp')
  .controller('LoanApplyCtrl', function ($rootScope, $scope, $state, UserService, FlashService, AuthService, ModalFactory, LoanService, CartService) {

    $scope.states = UserService.getStates();
    $scope.billing = {};
    $scope.incomeInfo = {};
    $scope.user = angular.copy(AuthService.getCurrentUser());
    $scope.modalFactory = ModalFactory;
    $scope.oldBillingAddress = null;
    $scope.oldPhone = null;
    var amount;

    var cartId = CartService.getCurrentCartId();
    if (cartId) {
      CartService.getTotals(cartId).then(function (totals) {
        angular.forEach(totals, function (total) {
          if (total.title === 'Grand Total') {
            amount = total.amount;
          }
        });
      }).catch(function (err) {
        $scope.sendAlertErrorMsg(err.data.message);
        $state.go('cart');
      });
    } else {
      $scope.noCart = true;
      $state.go('cart');
    }

    $scope.incomeInfoTypes = [
      {value: 'Employed (Non-Military)'},
      {value: 'Employed (Military)'},
      {value: 'Self-Employment'},
      {value: 'Retired/Benefits'},
      {value: 'Unemployment'},
      {value: 'Other'}
    ];

    $scope.sendAlertErrorMsg = function (msg) {
      FlashService.addAlert({
        type: 'danger',
        msg: msg,
        timeout: 10000
      });
    };

    $scope.apply = function () {
      $scope.submitted = true;
      if ($scope.loanApplyForm.$valid) {
        $scope.saveOrUpdateBillingAddress();
        var loanUser = angular.copy($scope.user);
        delete loanUser._id;
        loanUser.ssn = $scope.incomeInfo.securitySocial;
        LoanService.createUser(loanUser).then(function (userData) {

          var createUserContactInfo = function (contactInfo) {
            return LoanService.createUserContactInfo(contactInfo);
          };

          var createUserAddress = function (loanAddress) {
            return LoanService.createUserAddress(loanAddress);
          };

          createUserContactInfo({
            userId: userData.userId,
            label: 'email',
            type: 'email',
            value: loanUser.email
          }).then(function () {
            createUserContactInfo({
              userId: userData.userId,
              label: 'telephone',
              type: 'telephone',
              value: $scope.billing.phone
            }).then(function () {
              var loanAddress = angular.copy($scope.billing.address);
              loanAddress.userId = userData.userId;
              loanAddress.type = 'loan';
              loanAddress.label = 'loan';
              loanAddress.country = 'USA';
              return createUserAddress(loanAddress);
            }).then(function () {
              var applicationInfo = {
                incomeType: $scope.incomeInfo.type,
                monthlyGrossIncome: $scope.incomeInfo.monthlyGrossIncome,
                meta: userData,
                amount: amount,
                numberPayments: 6
              };
              LoanService.createLoanApplication(applicationInfo).then(function () {
                $state.go('payment-loan-sign-contract');
              });
            });
          });
        });
      }
    };

    $scope.validateSSN = function () {
      $scope.incomeInfo.securitySocial = angular.copy($scope.inputSSN);
      if ($scope.incomeInfo.securitySocial) {
        var pattern = /^\d{9}$/;
        $scope.loanApplyForm.socialSecurityNumber.$setValidity('pattern', pattern.test($scope.incomeInfo.securitySocial));
      } else {
        $scope.loanApplyForm.socialSecurityNumber.$setValidity('pattern', false);
      }
    };

    $scope.maskSSN = function () {
      if ($scope.inputSSN) {
        $scope.incomeInfo.securitySocial = angular.copy($scope.inputSSN);
        var temp = '';
        for(var i=0; i<$scope.inputSSN.length; i++) {
          temp += '*';
        }
        $scope.inputSSN = temp;
      }
    };

    $scope.unmaskSSN = function () {
      if ($scope.incomeInfo.securitySocial) {
        $scope.inputSSN = angular.copy($scope.incomeInfo.securitySocial);
      }
    };

    $scope.validateGrossIncome =  function () {
      if ($scope.incomeInfo && $scope.incomeInfo.monthlyGrossIncome) {
        $scope.loanApplyForm.monthlyGrossIncome.$setValidity('number', !isNaN($scope.incomeInfo.monthlyGrossIncome));
      } else {
        $scope.loanApplyForm.monthlyGrossIncome.$setValidity('number', false);
      }
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
    });
    
    UserService.getContactList($scope.user._id).then(function(data){
      angular.forEach(data, function (contactInfo) {
        UserService.getContact($scope.user._id, contactInfo.contactId).then(function (contact){
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
        if ($scope.loanApplyForm.address1.$dirty || $scope.loanApplyForm.address2.$dirty ||
            $scope.loanApplyForm.city.$dirty || $scope.loanApplyForm.state.$dirty ||
            $scope.loanApplyForm.zipCode.$dirty) {
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
    $rootScope.$emit('bar-welcome', {
      left:{
        url: 'app/payments/templates/loan-apply-bar.html'
      } ,
      right:{
        url: 'app/payments/templates/loan-apply-state-bar.html'
      }
    });
  });