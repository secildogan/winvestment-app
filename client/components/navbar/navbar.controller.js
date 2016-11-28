

angular.module('winvestmentApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $translate, $route, amMoment, $timeout, $window) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.hello = $translate.instant('Merhaba');

    $scope.refreshUserName = true;
    Auth.getCurrentUser(function () {
      $scope.refreshUserName = false;
      $timeout(function () {
        $scope.refreshUserName = true;
      }, 0);
    })

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

   $scope.isActive = function(route) {
     return route === $location.path();
   };

   $scope.locale = $translate.use();
   moment.locale($scope.locale);
   amMoment.changeLocale($scope.locale);

   $scope.$watch('locale', function () {
     if ($translate.use() !== $scope.locale) {
       if ($location.$$url.indexOf('/submit/en') > -1) {
         $window.location.href = '/submit/' + $scope.locale;
       } else {
         $translate.use($scope.locale);
         moment.locale($scope.locale);
         amMoment.changeLocale($scope.locale);
         $route.reload();
       }
     }
   });

   $scope.$watch('profile', function () {
     if ($scope.profile) {
       var p = angular.copy($scope.profile);
       $scope.profile = null;
       $location.path(p);
     }
   });
  });
