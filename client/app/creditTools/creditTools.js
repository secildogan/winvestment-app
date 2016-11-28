

angular.module('winvestmentApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/kredi', {
        templateUrl: 'app/creditTools/creditTools.html',
        controller: 'CreditToolsCtrl'
      });
  });
