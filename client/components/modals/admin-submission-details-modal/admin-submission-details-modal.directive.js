

angular.module('winvestmentApp')
  .directive('adminSubmissionDetailsModal', function () {
    return {
      templateUrl: 'components/modals/admin-submission-details-modal/admin-submission-details-modal.html',
      restrict: 'E',
      scope: {
        submission: '='
      },
      controller: function ($scope, $rootScope, $http) {
        $scope.specs = $rootScope.specs;
        $scope.getLabelByKey = function (arrayName, key) {
          var arr = $rootScope.specs[arrayName].vals;
          var i = _.findIndex(arr, function (o) {
            return o.key === key;
          });

          if (i > -1) {
            return arr[i].label;
          }

          return null;
        };

        $scope.addDots = function (intNum) {
          return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1.');
        }

        $scope.array2String = function (arr) {
          var str = '';
          var len = arr.length;
          arr.forEach(function (k, i) {
            if (i < len - 1) {
              str = str + k + ', ';
            } else {
              str += k;
            }
          });

          return str;
        };

        $scope.$watch('submission', function () {
          if (!_.isEmpty($scope.submission)) {
            if ($scope.submission.city && !_.isEmpty($scope.submission.districts)) {
              $http.post('/api/locations/' + $scope.submission.city, { districts: $scope.submission.districts })
              .success(function (res) {
                $scope.currentNeighborhoods = res;
              });
            }
          } else {
            $scope.currentNeighborhoods = null;
          }
        })
        $scope.editNotes = function () {
          if (!$scope.newNotes) {
            $scope.newNotes = angular.copy($scope.submission.admin_notes);
          }

          $scope.showEditNotes = true;
        }

        $scope.saveNotes = function () {
          $http.put('/api/submissions/' + $scope.submission._id, { admin_notes: $scope.newNotes })
          .success(function (res) {
            $scope.newNotes = null;
            $scope.submission = res;
            $scope.showEditNotes = false;
          });
        }
      }
    };
  });
