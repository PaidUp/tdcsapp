'use strict';

angular.module('convenienceApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'angulartics',
  'angulartics.mixpanel',
  'facebook',
  'angularNumberPicker',
  'ui.mask'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $analyticsProvider, FacebookProvider, $uiViewScrollProvider) {
    $analyticsProvider.virtualPageviews(false);
    $uiViewScrollProvider.useAnchorScroll();
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    FacebookProvider.init('717631811625048');
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, SessionService, $location, FlashService) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if (SessionService.getCurrentSession()) {
          config.headers.Authorization = 'Bearer ' + SessionService.getCurrentSession();
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          // due to circular dependency i can't add AuthService or CartService so
          // i need to make a logout event broadcast
          $rootScope.$emit('logout', {});
          $rootScope.$emit('bar-welcome', {
            left:{
              url: ''
            } ,
            right:{
              url: ''
            }
          });
          FlashService.addAlert({
            type:'warning',
            msg: 'Session has expired.',
            timeout: 10000
          });

          $location.path('/');
          // remove any state tokens
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $state, AuthService, $analytics, FlashService) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      //Mixpanel page tracker
      $analytics.pageTrack(next.url);
      var currentUserMp = AuthService.getCurrentUser();
      if(currentUserMp && currentUserMp._id){
        $analytics.setUsername(currentUserMp._id);
        currentUserMp.name = currentUserMp.email  +' - '+ currentUserMp.firstName;
        $analytics.setUserProperties(currentUserMp);
      }
      AuthService.isLoggedInAsync(function(loggedIn) {
        if (next.auth && !loggedIn) {
          $rootScope.$emit('logout', {});
          $rootScope.$emit('bar-welcome', {
            left:{
              url: ''
            },
            right:{
              url: ''
            }
          });
          $state.go('main');
          event.preventDefault();
        }
      });
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
      $state.previous = fromState;
      AuthService.isLoggedInAsync(function(loggedIn) {
        if (loggedIn) {
          var currentUser = AuthService.getCurrentUser();
          if (currentUser.verify && currentUser.verify.status !== 'verified') {
            FlashService.addAlert({
              type:'warning',
              templateUrl: 'components/application/directives/alert/alerts/verify-email.html'
            });
          }
          if (currentUser.payment &&
              currentUser.payment.verify &&
              currentUser.payment.verify.status !== 'succeeded') {
            FlashService.addAlert({
              type:'warning',
              templateUrl: 'components/application/directives/alert/alerts/verify-bank-account.html'
            });
          }
        }
      });
    });
  });