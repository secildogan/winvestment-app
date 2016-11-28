

angular.module('winvestmentApp')
  .run(function ($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function () {
      $('.modal-backdrop').remove();
    });
  });
