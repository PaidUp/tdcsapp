'use strict';

angular.module('convenienceApp')
  .controller('AccountCtrl', function ($scope, $rootScope, $state, UserService, AuthService, FlashService, ModalService,
  TrackerService) {

    $rootScope.$emit('bar-welcome', {
      left:{
        url: 'app/user/templates/user-bar.html'
      } ,
      right:{
        url: ''
      }
    });
    TrackerService.pageTrack();

    $scope.user = angular.extend({}, AuthService.getCurrentUser());
    $scope.oldUser = angular.extend({}, AuthService.getCurrentUser());
    $scope.oldShippingPhone = {};
    $scope.oldShippingAddress = {};
    $scope.oldBillingAddress = {};
    $scope.shipping = {
      address: {}
    };
    $scope.billing = {
      address: {}
    };
    $scope.modal = ModalService;
    $scope.states = UserService.getStates();

    $scope.load = function () {
      AuthService.isLoggedInAsync(function (loggedIn) {
        UserService.getContactList($scope.user._id).then(function (data){
          angular.forEach(data, function (contactInfo) {
            UserService.getContact($scope.user._id, contactInfo.contactId).then(function (contact){
              if (contact.label === 'shipping') {
                $scope.oldShippingPhone = contact;
                $scope.shipping.phone = contact.value;
              }
            }).catch(function (err) {
              $scope.sendAlertErrorMsg(err.data.message);
            });
          });
        }).catch(function (err) {
          $scope.sendAlertErrorMsg(err.data.message);
        });

        UserService.listAddresses($scope.user._id).then(function (data) {
          angular.forEach(data, function (address) {
            UserService.getAddress($scope.user._id, address.addressId).then(function (addressObj) {
              if (addressObj.type === 'shipping') {
                $scope.oldShippingAddress = addressObj;
                $scope.shipping.address   = angular.extend({}, addressObj);
              } else if (addressObj.type === 'billing') {
                $scope.oldBillingAddress = addressObj;
                $scope.billing.address   = angular.extend({}, addressObj);
              }
              if (Object.keys($scope.oldShippingAddress).length !== 0 &&
                  Object.keys($scope.oldBillingAddress).length !== 0) {
                if ($scope.oldShippingAddress.address1 === $scope.oldBillingAddress.address1 &&
                    $scope.oldShippingAddress.address2 === $scope.oldBillingAddress.address2 &&
                    $scope.oldShippingAddress.city     === $scope.oldBillingAddress.city     &&
                    $scope.oldShippingAddress.state    === $scope.oldBillingAddress.state    &&
                    $scope.oldShippingAddress.zipCode  === $scope.oldBillingAddress.zipCode) {
                  $scope.sameBillingAsShiping = true;
                }
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

    $scope.load();

    $scope.sendAlertUpdateProfileSuccess = function () {
      FlashService.addAlert({
        type: 'success',
        templateUrl: 'components/application/directives/alert/alerts/update-profile-success.html',
        timeout: 5000
      });
    };

    $scope.sendAlertErrorMsg = function (msg) {
      FlashService.addAlert({
        type: 'danger',
        msg: msg,
        timeout: 10000
      });
    };

    $scope.updateProfile = function () {
      UserService.updateUser({
        firstName: $scope.user.firstName,
        lastName:  $scope.user.lastName,
        userId:    $scope.user._id
      }).then(function () {
        $scope.sendAlertUpdateProfileSuccess();
        angular.extend(AuthService.getCurrentUser(), $scope.user);
        $scope.oldUser = angular.extend({}, AuthService.getCurrentUser());
      }).catch(function (err) {
        $scope.sendAlertErrorMsg(err.data.message);
      });
    };

    $scope.updateEmail = function () {
      AuthService.updateEmail($scope.user.email, $scope.user._id).then(function (){
        $scope.sendAlertUpdateProfileSuccess();
        angular.extend(AuthService.getCurrentUser(), $scope.user);
        $scope.oldUser = angular.extend({}, AuthService.getCurrentUser());
      }).catch(function (err){
        $scope.sendAlertErrorMsg(err.data.message);
      });
    };

    $scope.updatePassword = function () {
      AuthService.updatePassword($scope.user.password, $scope.user.newPassword, $scope.user._id).then(function () {
        delete $scope.user.password;
        delete $scope.user.newPassword;
        delete $scope.user.confirmNewPassword;
        FlashService.addAlert({
          type: 'success',
          templateUrl: 'components/application/directives/alert/alerts/update-password-success.html',
          timeout: 5000
        });
      }).catch(function (err){
        $scope.sendAlertErrorMsg(err.data.message);
      });
    };

    $scope.updateAddress = function (address) {
      UserService.updateAddress(address.addressId, address, $scope.user._id).then(function (data) {
        address.addressId = data.addressId;
        $scope.sendAlertUpdateProfileSuccess();
      }).catch(function (err) {
        $scope.sendAlertErrorMsg(err.data.message);
      });
    };

    $scope.createAddress = function (address) {
      UserService.createAddress(address).then(function (data) {
        address.addressId = data.addressId;
        $scope.sendAlertUpdateProfileSuccess();
      }).catch(function (err) {
        $scope.sendAlertErrorMsg(err.data.message);
      });
      $scope.load();
    };

    $scope.createInfoPhone = function (phone, label) {
      var phoneInfo = {
        label:  label,
        type:  'telephone',
        value:  phone,
        userId: $scope.user._id
      };
      UserService.createContact(phoneInfo).then(function (data) {
        phoneInfo.contactId = data.contactId;
        $scope.sendAlertUpdateProfileSuccess();
      }).catch(function (err) {
        $scope.sendAlertErrorMsg(err.data.message);
      });
      $scope.load();
    };

    $scope.updateInfoPhone = function (phoneInfo) {
      UserService.contactUpdate(phoneInfo, $scope.user._id).then(function (data) {
        phoneInfo.contactId = data.contactId;
        $scope.sendAlertUpdateProfileSuccess();
      }).catch(function (err) {
        $scope.sendAlertErrorMsg(err.data.message);
      });
    };

    $scope.updateAccount = function () {
      $scope.submitted = true;

      if ($scope.profileForm.$dirty && $scope.profileForm.$valid) {
        if ($scope.user.firstName !== $scope.oldUser.firstName ||
            $scope.user.lastName  !== $scope.oldUser.lastName) {
          // submit profile update
          $scope.updateProfile();
          TrackerService.create('Update account name' , {
            oldFistName : $scope.oldUser.firstName,
            oldLastName : $scope.oldUser.lastName,
            newFistName : $scope.user.firstName,
            newLastName : $scope.user.lastName
          })
          $scope.profileForm.$setPristine();
        }
        if ($scope.user.email !== '' && $scope.user.email !== $scope.oldUser.email) {
          // submit email update
          $scope.updateEmail();
          TrackerService.create('Update account email' , {
            oldEmail :  $scope.oldUser.email,
            newEmail :  $scope.user.email
          })
          $scope.profileForm.$setPristine();
        }
      }

      if ($scope.passwordForm.$dirty && $scope.user.password && $scope.user.password !== '') {
        if ($scope.passwordForm.$valid) {
          // submit password update
          $scope.updatePassword();
          TrackerService.create('Update account password',{});
          $scope.passwordForm.$setPristine();
        }
      }

      if ($scope.shippingPhoneForm.$dirty && $scope.shipping.phone && $scope.shipping.phone !== '') {

        // Object.keys(a) if for check empty object
        if (Object.keys($scope.oldShippingPhone).length !== 0) {
          // submit shipping phone update
          TrackerService.create('Update account info phone',{
            oldShippingPhone :$scope.oldShippingPhone.value,
          });
          $scope.oldShippingPhone.value  = $scope.shipping.phone;
          $scope.oldShippingPhone.userId = $scope.user._id;
          $scope.updateInfoPhone($scope.oldShippingPhone);
          $scope.shippingPhoneForm.$setPristine();
        } else {
          // submit create shipping phone
          $scope.createInfoPhone($scope.shipping.phone, 'shipping');
          TrackerService.create('Update account create info phone',{
            oldShippingPhone :$scope.oldShippingPhone.value,
          });
          $scope.oldShippingPhone.value  = $scope.shipping.phone;
          $scope.oldShippingPhone.userId = $scope.user._id;
          $scope.shippingPhoneForm.$setPristine();
        }
      }

      if ($scope.shippingForm.$dirty &&
          $scope.shipping.address.address1 && $scope.shipping.address.address1 !== '' &&
          $scope.shipping.address.city     && $scope.shipping.address.city     !== '' &&
          $scope.shipping.address.address2 && $scope.shipping.address.address2 !== '' &&
          $scope.shipping.address.zipCode  && $scope.shipping.address.zipCode  !== '' &&
          $scope.shipping.address.state    && $scope.shipping.address.state    !== '') {

        if (Object.keys($scope.oldShippingAddress).length !== 0) {
          // update shipping address
          $scope.shipping.address.userId = $scope.user._id;
          $scope.oldShippingAddress = angular.extend({}, $scope.shipping.address);
          $scope.updateAddress($scope.oldShippingAddress);

          if ($scope.sameBillingAsShiping) {
            if (Object.keys($scope.oldBillingAddress).length !== 0) {

              $scope.oldBillingAddress.address1 = $scope.shipping.address.address1;
              $scope.oldBillingAddress.address2 = $scope.shipping.address.address2;
              $scope.oldBillingAddress.city     = $scope.shipping.address.city;
              $scope.oldBillingAddress.state    = $scope.shipping.address.state;
              $scope.oldBillingAddress.zipCode  = $scope.shipping.address.zipCode;
              $scope.oldBillingAddress.userId   = $scope.user._id;
              $scope.oldBillingAddress.label    = 'billing';
              $scope.oldBillingAddress.type     = 'billing';
              $scope.oldBillingAddress.country  = 'USA';

              $scope.updateAddress($scope.oldBillingAddress);
              // $state.go($state.current, {}, {reload: true});
              $scope.billing.address = angular.extend({}, $scope.oldBillingAddress);

            } else {
              $scope.billing.address         = angular.extend({}, $scope.shipping.address);
              $scope.billing.address.label   = 'billing';
              $scope.billing.address.type    = 'billing';
              $scope.billing.address.country = 'USA';

              $scope.createAddress($scope.billing.address);
              $scope.oldBillingAddress = angular.extend({}, $scope.billing.address);
            }
          } else {
            $scope.shippingForm.$setPristine();
          }
        } else {
          // create shipping address
          $scope.shipping.address.type    = 'shipping';
          $scope.shipping.address.label   = 'shipping';
          $scope.shipping.address.country = 'USA';
          $scope.shipping.address.userId  = $scope.user._id;
          $scope.oldShippingAddress       = angular.extend({}, $scope.shipping.address);

          $scope.createAddress($scope.shipping.address);

          if ($scope.sameBillingAsShiping) {
            if (Object.keys($scope.oldBillingAddress).length !== 0) {

              $scope.oldBillingAddress.address1 = $scope.shipping.address.address1;
              $scope.oldBillingAddress.address2 = $scope.shipping.address.address2;
              $scope.oldBillingAddress.city     = $scope.shipping.address.city;
              $scope.oldBillingAddress.state    = $scope.shipping.address.state;
              $scope.oldBillingAddress.zipCode  = $scope.shipping.address.zipCode;
              $scope.oldBillingAddress.userId   = $scope.user._id;
              $scope.oldBillingAddress.label    = 'billing';
              $scope.oldBillingAddress.type     = 'billing';
              $scope.oldBillingAddress.country  = 'USA';

              $scope.updateAddress($scope.oldBillingAddress);
              // $state.go($state.current, {}, {reload: true});
              $scope.billing.address = angular.extend({}, $scope.oldBillingAddress);
            } else {
              $scope.billing.address         = angular.extend({}, $scope.shipping.address);
              $scope.billing.address.label   = 'billing';
              $scope.billing.address.type    = 'billing';
              $scope.billing.address.country = 'USA';

              $scope.createAddress($scope.billing.address);
              $scope.oldBillingAddress = angular.extend({}, $scope.billing.address);
            }
          } else {
            $scope.shippingForm.$setPristine();
          }
        }
        $scope.shippingForm.$setPristine();
      }

      if ($scope.billingForm.$dirty       && $scope.billingForm.$valid &&
          $scope.billing.address.address1 && $scope.billing.address.address1 !== '' &&
          $scope.billing.address.city     && $scope.billing.address.city     !== '' &&
          $scope.billing.address.address2 && $scope.billing.address.address2 !== '' &&
          $scope.billing.address.zipCode  && $scope.billing.address.zipCode  !== '' &&
          $scope.billing.address.state    && $scope.billing.address.state    !== '') {

        if (Object.keys($scope.oldBillingAddress).length !== 0) {
          // update billing address
          $scope.billing.address.userId = $scope.user._id;
          $scope.oldBillingAddress      = angular.extend({}, $scope.billing.address);

          $scope.updateAddress($scope.oldBillingAddress);
          $scope.billingForm.$setPristine();
        } else {
          // create billing address
          $scope.billing.address.type    = 'billing';
          $scope.billing.address.label   = 'billing';
          $scope.billing.address.country = 'USA';
          $scope.billing.address.userId  = $scope.user._id;
          $scope.oldBillingAddress       = angular.extend({}, $scope.billing.address);

          $scope.createAddress($scope.billing.address);
          $scope.billingForm.$setPristine();
        }
      }
    };
  });
