

angular.module('winvestmentApp')
  .controller('SuccessCtrl', function($scope, data, $rootScope) {
    $scope.submission = data;
    $scope.getLabelByKey = function(arrayName, key) {
      var arr = $rootScope.specs[arrayName].vals;
      var i = _.findIndex(arr, function(o) {
        return o.key === key;
      });

      if (i > -1) {
        return arr[i].label;
      }

      return null;
    };

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

    $scope.addDots = function(intNum) {
      return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1.');
    }
  });
