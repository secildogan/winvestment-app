

angular.module('winvestmentApp')
  .controller('AdminContactsCtrl', function($scope, $route, data) {
    $scope.data = data;

    $scope.search = function (params) {
      $scope.data.isLoading = true;

      $scope.data.params = _.extend($scope.data.params, params);

      if (!params.page) {
        params.page = 1;
      }

      $route.updateParams(params);
    };
  });
