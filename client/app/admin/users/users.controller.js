

angular.module('winvestmentApp')
  .controller('AdminUsersCtrl', function($scope, $http, User, $route, data) {
    $scope.data = data;

    $scope.delete = function (user) {
      User.remove({ id: user._id });
      $scope.users.splice(this.$index, 1);
    };

    $scope.search = function (params) {
      $scope.data.isLoading = true;

      $scope.data.params = _.extend($scope.data.params, params);

      if (!params.page) {
        params.page = 1;
      }

      $route.updateParams(params);
    };

    $scope.userDetails = function (user) {
      $scope.selected = user;
      $('#admin-user-details-modal').modal();
    }

    $scope.$watch('selected', function (updated, old) {
      if (updated && old && updated.admin_notes !== old.admin_notes) {
        var i = _.findIndex($scope.data.items.items, function (u) {
          return u._id === updated._id;
        });

        if (i > -1) {
          $scope.data.items.items[i].admin_notes = updated.admin_notes;
        }
      }
    });
  });
