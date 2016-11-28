

angular.module('winvestmentApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/faq', {
        templateUrl: 'app/faq/faq.html'
      });
  });
