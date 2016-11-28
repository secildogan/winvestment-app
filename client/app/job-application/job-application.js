

angular.module('winvestmentApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/human-resources', {
        templateUrl: 'app/job-application/job-application.html',
        controller: 'JobApplicationCtrl'
      });
  });
