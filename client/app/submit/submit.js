

angular.module('winvestmentApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/submit/:locale', {
        templateUrl: 'app/submit/submit.html',
        controller: 'SubmitCtrl',
        resolve: {
          setLocale: function ($route, $translate, amMoment) {
            var currentLocale = $translate.use();
            var locale = $route.current.params.locale;
            if (locale && locale !== currentLocale) {
              $translate.use(locale);
              moment.locale(locale);
              amMoment.changeLocale(locale);
              $route.reload();
            }
          }
        }
      });
  });
