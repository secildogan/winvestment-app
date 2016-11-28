

angular.module('winvestmentApp')
  .directive('mustLoginModal', function () {
    return {
      templateUrl: 'components/modals/must-login-modal/must-login-modal.html',
      restrict: 'E',
      controller: 'MustLoginModalCtrl'
    };
  });
