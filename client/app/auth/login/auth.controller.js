'use strict';

angular.module('convenienceApp')
  .factory('ModalService', function ($rootScope, $modal) {
    return {
      closeModal: function () {
        $rootScope.modalInstance.dismiss('cancel');
      },

      openModal: function () {
        $rootScope.modalInstance = $modal.open({
            templateUrl: 'auth.html',
            controller: 'AuthCtrl',
            size: 'sm'
          });
      },

      showContent : function(content) {
        if (content === 'login') {
          $rootScope.showLogin = true;
          $rootScope.showSignup = false;
          $rootScope.showForgotPassword = false;
          $rootScope.showResetPassword = false;
          $rootScope.showVerifyEmail = false;
        } else if (content === 'signup') {
          $rootScope.showSignup = true;
          $rootScope.showLogin = false;
          $rootScope.showForgotPassword = false;
          $rootScope.showResetPassword = false;
          $rootScope.showVerifyEmail = false;
        } else if (content === 'forgotPassword') {
          $rootScope.showForgotPassword = true;
          $rootScope.showSignup = false;
          $rootScope.showLogin = false;
          $rootScope.showResetPassword = false;
          $rootScope.showVerifyEmail = false;
        } else if (content === 'resetPassword') {
          $rootScope.showResetPassword = true;
          $rootScope.showSignup = false;
          $rootScope.showLogin = false;
          $rootScope.showForgotPassword = false;
          $rootScope.showVerifyEmail = false;
        } else if (content === 'verifyEmail') {
          $rootScope.showVerifyEmail = true;
          $rootScope.showResetPassword = false;
          $rootScope.showSignup = false;
          $rootScope.showLogin = false;
          $rootScope.showForgotPassword = false;
        }
      }
    };
  });

angular.module('convenienceApp').controller('AuthCtrl', function ($scope, ModalService, AuthService, $state, $rootScope, FlashService, $timeout) {
  $scope.showRole = true;
  $scope.hideRole = true;
  $scope.user = {};
  $scope.error = null;
  $scope.log_in = 'Log in with Facebook';
  $scope.signup = 'Sign up with Facebook';
  $scope.modal = ModalService;

  $scope.destPath = function(value, isParent){
    $scope.showRole = isParent;
    AuthService.destPath(value);
  };

  $scope.resetState = function() {
    $scope.user = {};
    $scope.submitted = false;
    $scope.error = null;
    if ($scope.forgotForm) {$scope.forgotForm.$setPristine();}
    if ($scope.resetForm) {$scope.resetForm.$setPristine();}
    if ($scope.form) {$scope.form.$setPristine();}
    if ($scope.loginForm) {$scope.loginForm.$setPristine();}
  };

  $scope.$watch('error', function () {
    $timeout(function () {
      $scope.error = null;
    }, 5000);
  });

  // LOGIN function
  $scope.login = function(form) {
    $scope.submitted = true;

    if(form.$valid) {
      var credentials = {
        rememberMe: $scope.user.loginRememberMe,
        email: $scope.user.email,
        password: $scope.user.password
      };
      var success = function() {
        // Logged in, redirect to home
        $scope.modal.closeModal();
        $state.go(AuthService.getDest());
        AuthService.setDest();
        if ($rootScope.currentUser.verify && $rootScope.currentUser.verify.status !== 'verified') {
          FlashService.addAlert({
            type:'warning',
            templateUrl: 'components/application/directives/alert/alerts/verify-email.html'
          });
        }
      };
      var error = function(err) {
        $scope.error = err.message;
      };
      AuthService.login(credentials, success, error);
    }
  };
  // END LOGIN function

  // SIGNUP function
  $scope.emailBtnClick = function(){
    $scope.hideRole = false;
    $scope.emailClick = $scope.emailClick ? false : true;
  };

  $scope.register = function(form) {
    $scope.submitted = true;
    if(form.$valid) {
      var user = {
        firstName: $scope.user.firstName,
        lastName: $scope.user.lastName
      };
      var credentials = {
        email: $scope.user.email,
        password: $scope.password,
        rememberMe: $scope.user.signupRememberMe
      };
      var success = function (data) {
        AuthService.addCredentials(data.userId, credentials, function() {
          // Account created, redirect to home
          // $scope.modal.closeModal();
          $scope.modal.showContent('verifyEmail');
          FlashService.addAlert({
            type:'warning',
            templateUrl: 'components/application/directives/alert/alerts/verify-email.html'
          });
          $state.go(AuthService.getDest());
          AuthService.setDest();
        }, error);
      };

      var error = function (err) {
        $scope.error = err.message;
      };

      AuthService.createUser(user, success, error);
    }
  };

  $scope.goToTermsOfService = function () {
    $scope.modal.closeModal();
    $state.go('terms-of-service');
  };

  $scope.goToPrivacyPolicy = function () {
    $scope.modal.closeModal();
    $state.go('privacy-policy');
  };
  // END SIGNUP function

  // RESET function
  $scope.reset = function (form) {
    $scope.submitted = true;
    if (form.$valid) {
      AuthService.resetPassword($rootScope.token, $scope.password, function(){
        delete $rootScope.token;
        $scope.modal.closeModal();
      },
      function(err){
        $scope.error = err.message;
      });
    }
  };
  // END RESET function

  // FORTGOT function
  $scope.forgot = function (form) {
    $scope.submitted = true;
    if (form.$valid) {
      AuthService.forgotPassword($scope.user.email, function () {});
      $scope.sent = true;
    }
  };
  // END FORTGOT function
});