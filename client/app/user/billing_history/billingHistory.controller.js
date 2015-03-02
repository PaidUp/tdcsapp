'use strict';

angular.module('convenienceApp')
  .controller('BillingHistoryCtrl', function ($scope, $rootScope, CommerceService, FlashService) {
    $rootScope.$emit('bar-welcome', {
      left:{
        url: 'app/user/templates/user_history_billing_bar.html'
      } ,
      right:{
        // url: 'app/user/templates/downlod_pdf_bar.html'
        url: ''
      }
    });

    $scope.sendAlertErrorMsg = function (msg) {
      FlashService.addAlert({
        type: 'danger',
        msg: msg,
        timeout: 10000
      });
    };
    $scope.initLimit = 10;

    $scope.loading = true;
    $scope.transactions = [];
    CommerceService.getUsertransactions().then(function (response) {
      if (response.length === 0) {
        $scope.noBillinHistory = true;
      }
      angular.forEach(response, function (userTransactions) {
        // console.log(userTransactions);
        angular.forEach(userTransactions.transactions, function (transaction) {
          transaction.createdAt = $scope.formatDate(transaction.createdAt);
          transaction.order = userTransactions.order;
          $scope.transactions.push(transaction);
        });
      });
      $scope.loading = false;
    }).catch(function (err) {
      $scope.loading = false;
      $scope.sendAlertErrorMsg(err.data.message);
    });

    $scope.formatDate = function (date) {
      return moment(date).format('M/D/YY');
    };

    $scope.moreResults = function () {
      $scope.initLimit += 10;
    };
  });