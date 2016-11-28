

angular.module('winvestmentApp')
  .directive('bannerModal', function () {
    return {
      templateUrl: 'components/modals/banner-modal/banner-modal.html',
      restrict: 'E',
      scope: {
        locale: '='
      },
      controller: function ($scope) {
        $scope.close = function () {
          $('#banner-modal').modal('hide');
        }
      }
    };
  });
