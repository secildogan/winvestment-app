

angular.module('winvestmentApp')
  .controller('AdminSubmissionsCtrl', function($scope, $http, $route, data) {
    $scope.data = data;

    $scope.search = function (params) {
      $scope.data.isLoading = true;

      $scope.data.params = _.extend($scope.data.params, params);

      if (!params.page) {
        params.page = 1;
      }

      $route.updateParams(params);
    };

    $scope.submissionDetails = function (sub) {
      $scope.selected = sub;
      $('#admin-submission-details-modal').modal();
    }

    $scope.addDots = function (intNum) {
      return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1.');
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
