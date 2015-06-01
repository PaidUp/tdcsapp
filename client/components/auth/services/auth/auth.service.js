'use strict';

angular.module('convenienceApp')
  .factory('AuthService', function Auth($rootScope, $http, UserService, SessionService, Facebook) {

    if(SessionService.getCurrentSession()) {
      $rootScope.currentUser = UserService.get(SessionService.getCurrentSession());
    }

    $rootScope.$on('logout', function () {
      delete $rootScope.currentUser;
    });

    var dest = 'athletes';
    var isParent = true;

    return {

      getDest :function(){
        return dest;
      },

      getIsParent :function(){
        return isParent;
      },

      destPath :function(value, parent){
        dest  = value;
        isParent = parent;
      },

      setDest :function(){
        dest  = 'athletes';
      },

      setIsParent :function(){
        isParent  = true;
      },

      updateCurrentUser: function () {
        $rootScope.$emit('close-alerts');
        $rootScope.currentUser = UserService.get(SessionService.getCurrentSession());
      },

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function(user, successFn, errorFn) {
        var success = successFn || angular.noop;
        var error = errorFn || angular.noop;
        var context = this;
        $http.post('/api/v1/auth/local/login', {
          email: user.email,
          password: user.password,
          rememberMe: user.rememberMe
        })
        .success(function(data) {
          SessionService.addSession(data);
          UserService.get(data.token, function(user){
            $rootScope.currentUser = user;
            success();
          });
        })
        .error(function(err) {
          context.logout();
          error(err);
        });
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function() {
        SessionService.removeCurrentSession();
        delete $rootScope.currentUser;
      },

      loginFacebook: function(successFn, errorFn) {
        var success = successFn || angular.noop;
        var error = errorFn || angular.noop;
        var loginSuccess = function(user) {
          if (user.status === 'not_authorized') {
            error('User authorization denied');
            return;
          }
          $http.post('/api/v1/auth/facebook', {facebookToken:user.authResponse.accessToken}).
            success(function(data) {
            $rootScope.currentUser = UserService.get(data.token, function(user){
              SessionService.addSession(data);
              success(user);
            });
          }).error(function(data) {
            error(data);
          });
        };
        Facebook.login(loginSuccess, {scope: 'email'});
      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser: function(user, successFn, errorFn) {
        var success = successFn || angular.noop;
        var error = errorFn || angular.noop;
        UserService.save(user, success, function (httpResponse){
          error(httpResponse.data);
        });
      },

      addCredentials: function(userId, credentials, successFn, errorFn) {
        var success = successFn || angular.noop;
        var error = errorFn || angular.noop;
        $http.post('/api/v1/auth/local/signup', {
          userId: userId,
          email: credentials.email,
          password: credentials.password
        }).
        success(function(data) {
          $rootScope.currentUser = UserService.get(data.token, function(user){
            SessionService.addSession(data);
            success(user);
          });
        }).
        error(function(err) {
          error(err);
        });
      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      forgotPassword: function(email, successFn, errorFn){
        var success = successFn || angular.noop;
        var error = errorFn || angular.noop;
        $http.post('/api/v1/auth/password/reset-request', {
          email: email
        },{
          withCredentials: false
        }).
        success(success).
        error(error);
      },

      resetPassword: function(token, password, successFn, errorFn){
        var success = successFn || angular.noop;
        var error = errorFn || angular.noop;
        $http.post('/api/v1/auth/password/reset', {
          verifyToken: token,
          password: password
        },{
          withCredentials: false
        }).
        success(success).
        error(error);
      },

      updatePassword: function(oldPassword, newPassword, userId) {
        return $http.post('/api/v1/auth/password/update/userId/'+ userId, {
          currentPassword: oldPassword,
          newPassword: newPassword
        });
      },

      verifyEmailToken: function(token, successFn, errorFn){
        var success = successFn || angular.noop;
        var error = errorFn || angular.noop;
        $http.post('/api/v1/auth/verify', {
          verifyToken: token
        },{
          withCredentials: false
        }).
        success(success).
        error(error);
      },

      resendEmail: function(userId, successFn, errorFn){
        var success = successFn || angular.noop;
        var error = errorFn || angular.noop;
        $http.get('/api/v1/auth/verify-request/userId/'+userId)
        .success(function(data){
          //console.log(data);
        })
        .error(error);
      },

      updateEmail: function(email, userId){
        return $http.post('/api/v1/auth/email/update/userId/'+userId,{
          email: email,
          userId: userId
        });
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        return $rootScope.currentUser;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return angular.isDefined($rootScope.currentUser); // && $rootScope.currentUser.hasOwnProperty('role');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function(cb) {
        if (!angular.isDefined($rootScope.currentUser)) {
          cb(false);
          return;
        } else if ($rootScope.currentUser.hasOwnProperty('$promise')) {
          $rootScope.currentUser.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else {
          cb(true);
        }
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function() {
        return angular.isDefined($rootScope.currentUser) && $rootScope.currentUser.role === 'admin';
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return SessionService.getCurrentSession();
      }
    };
  });