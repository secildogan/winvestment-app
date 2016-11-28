

angular.module('winvestmentApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/terms-of-use', {
        templateUrl: 'app/terms-of-use/terms-of-use.html',
        controller: 'TermsOfUseCtrl'
      });
  });
