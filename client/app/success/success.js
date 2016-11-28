

angular.module('winvestmentApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/success/:id', {
        templateUrl: 'app/success/success.html',
        controller: 'SuccessCtrl',
        resolve: {
          data: function ($q, $http, $route) {
            var deferred = $q.defer();

            $http.get('/api/submissions/' + $route.current.params.id)
            .success(function (res) {
              deferred.resolve(res);
            }).error(function () {
              deferred.reject('Error');
            });

            return deferred.promise;
          }
        }
      });
  });
