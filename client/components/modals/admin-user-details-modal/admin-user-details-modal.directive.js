

angular.module('winvestmentApp')
  .directive('adminUserDetailsModal', function () {
    return {
      templateUrl: 'components/modals/admin-user-details-modal/admin-user-details-modal.html',
      restrict: 'E',
      scope: {
        user: '='
      },
      controller: function ($scope, $http) {
        $scope.editNotes = function () {
          if (!$scope.newNotes) {
            $scope.newNotes = angular.copy($scope.user.admin_notes);
          }

          $scope.showEditNotes = true;
        }

        $scope.saveNotes = function () {
          $http.put('/api/users/' + $scope.user._id, { admin_notes: $scope.newNotes })
          .success(function (res) {
            $scope.newNotes = null;
            $scope.user = res;
            $scope.showEditNotes = false;
          });
        }
      }
    };
  });
