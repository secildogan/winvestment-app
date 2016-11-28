

angular.module('winvestmentApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/privacy', {
        templateUrl: 'app/privacy/privacy.html',
        controller: 'PrivacyCtrl'
      });
  });
