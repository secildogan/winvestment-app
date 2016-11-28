

angular.module('winvestmentApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/admin/users', {
        templateUrl: 'app/admin/users/users.html',
        controller: 'AdminUsersCtrl',
        authenticate: 'admin',
        resolve: {
          data: function ($q, $http, $route) {
            var deferred = $q.defer();
            var params = $route.current.params;

            $http({ type: 'GET', url: '/api/users', params: params }).success(function (data) {
              deferred.resolve({ items: data, params: params, isLoading: false });
            }).error(function () {
              deferred.resolve({ items: null, params: params, isLoading: false });
            });

            return deferred.promise;
          }
        }
      });
  });
