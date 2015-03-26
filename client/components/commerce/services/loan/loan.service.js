'use strict';

angular.module('convenienceApp')
  .service('LoanService', function ($cookieStore, $q, $resource, $rootScope) {
    var LoanApplication = $resource('/api/v1/loan/application/:action', {}, {});
    var LoanService = this;
    $rootScope.$on('logout', function () {
      LoanService.removeCurrentLoanApplication();
      LoanService.removeCurrentLoan();
    });

    this.createLoanApplication = function (userInfo) {

      var deferred = $q.defer();

      LoanApplication.save({action: 'create'}, userInfo).$promise.then(function (applicationData){

        $cookieStore.put('loanApplicationId', applicationData.applicationId);
        deferred.resolve(applicationData);

      }).catch(function(err){

        deferred.reject(err);

      });

      return deferred.promise;

    };

    this.setLoanId = function (loanId) {
      $cookieStore.put('loanId', loanId);
    };

    this.getLoanId = function () {
      return $cookieStore.get('loanId');
    };

    this.removeCurrentLoan = function () {
      $cookieStore.remove('loanId');
    };

    var Loan = $resource('/api/v1/loan/:loanId', {}, {});
    this.getLoan = function () {
      return Loan.get({loanId: this.getLoanId()}).$promise;
    };

    this.getLoanApplicationId = function () {
      return $cookieStore.get('loanApplicationId');
    };

    this.removeCurrentLoanApplication = function () {
      $cookieStore.remove('loanApplicationId');
    };

    this.setState = function (applicationInfo) {
      return LoanApplication.save({action: 'state'}, applicationInfo).$promise;
    };

    this.signContract = function (userInfo) {
      var deferred = $q.defer();
      LoanApplication.save({action: 'sign'}, userInfo).$promise.then(function (resp) {
        LoanService.setLoanId(resp.loanId);
        deferred.resolve();
      }).catch(function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    var LoanUser = $resource('/api/v1/loan/application/user/:action', {}, {
      post: { method:'POST', isArray: true }
    });
    var LoanUserContact = $resource('/api/v1/loan/application/user/contact/:action', {}, {});
    var LoanUserAddress = $resource('/api/v1/loan/application/user/address/:action', {}, {});

    this.createUser = function (userInfo) {
      return LoanUser.save({action: 'create'}, userInfo).$promise;
    };

    this.getLoanApplicationUser = function (loanUserId) {
      return LoanUser.post({action: ''}, {id: loanUserId}).$promise;
    };

    this.createUserContactInfo = function (userContactInfo) {
      return LoanUserContact.save({
        action: 'create'
      }, userContactInfo).$promise;
    };

    this.createUserAddress = function (userAddress) {
      return LoanUserAddress.save({
        action: 'create'
      }, userAddress).$promise;
    };

    var LoanVerifyState = $resource('/api/v1/loan/application/:applicationId');

    this.verifyApplicationState = function () {
      return LoanVerifyState.get({
        applicationId: this.getLoanApplicationId()
      }).$promise;
    };

    // real simulation
    this.getLoanPaymentSimulation = function (applicationData) {
      return LoanApplication.save({action: 'simulate'}, applicationData).$promise;
    };

    // contract HTML
    this.getContract = function (applicationId, loanUserId) {
      var deferred = $q.defer();
      var loanUser = {};
      this.getLoanApplicationUser(loanUserId).then(function (user) {
        loanUser = user[0];
        LoanApplication.save(
          {action: 'contract'}, 
          {
            applicationId: applicationId,
            loanUser: loanUser
          }
        ).$promise.then(function (resp) {
          deferred.resolve(resp);
        }).catch(function (err) {
          deferred.reject(err);
        });
      });
      
      return deferred.promise;
    };

    // fake simulation
    var LoanSimulation = $resource('/api/v1/loan/simulate');
    this.getLoanSimulation = function (simulationData) {
      return LoanSimulation.save(simulationData).$promise;
    };
  });