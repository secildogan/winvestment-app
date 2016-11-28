

angular.module('winvestmentApp')
  .directive('footer', function () {
    return {
      templateUrl: 'components/footer/footer.html',
      restrict: 'E',
      link: function (scope, element) {
        element.addClass('footer');
      },
      controller: function($scope, $rootScope, $location, $interval) {
        $scope.goToAboutUs = function() {
          if ($location.path() !== '/') {
            $location.path('/');

            var cnt = 0;
            var checkAboutUs = $interval(function () {
              cnt++;
              if (cnt >= 20) {
                $interval.cancel(checkAboutUs);
              }

              if ($("#aboutUsSection").length) {
                $('html, body').animate({
                  scrollTop: $("#aboutUsSection").offset().top
                }, 1000);

                $interval.cancel(checkAboutUs);
              }
            }, 500);
          } else {
            $('html, body').animate({
              scrollTop: $("#aboutUsSection").offset().top
            }, 1000);
          }
        };
      }
    };
  });
