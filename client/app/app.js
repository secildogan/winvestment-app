

angular.module('winvestmentApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'btford.socket-io',
    'ui.bootstrap',
    'validation.match',
    'ngMaterial',
    'countUpModule',
    'scrollSpyModule',
    'ngStorage',
    'ui-rangeSlider',
    'pascalprecht.translate',
    'angularMoment',
    'ui-notification'
  ])
  .config(function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

.config(function($mdThemingProvider, $mdDateLocaleProvider) {
  $mdThemingProvider.definePalette('dollar', {
    '50': '#75f8b7',
    '100': '#2cf491',
    '200': '#0cdc75',
    '300': '#089851',
    '400': '#077b41',
    '500': '#055e32',
    '600': '#04512c',
    '700': '#084024',
    '800': '#00361f',
    '900': '#002b19',
    'A100': '#75f8b7',
    'A200': '#2cf491',
    'A400': '#077b41',
    'A700': '#022413',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 A100 A200'
  });
  $mdThemingProvider.definePalette('dollar2', {
    '50': '#077b41',
    '100': '#077b41',
    '200': '#077b41',
    '300': '#089851',
    '400': '#077b41',
    '500': '#055e32',
    '600': '#04512c',
    '700': '#084024',
    '800': '#00361f',
    '900': '#002b19',
    'A100': '#077b41',
    'A200': '#077b41',
    'A400': '#077b41',
    'A700': '#022413',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ''
  });

  $mdThemingProvider.theme('default')
    .primaryPalette('dollar2')
    .accentPalette('dollar2');

  // Turkish localization.
  $mdDateLocaleProvider.months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  $mdDateLocaleProvider.shortMonths = $mdDateLocaleProvider.months.map(function(m) {
    return m.substring(0, 3);
  });
  $mdDateLocaleProvider.days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  $mdDateLocaleProvider.shortDays = $mdDateLocaleProvider.days.map(function(d) {
    return d.substring(0, 3);
  });

  $mdDateLocaleProvider.formatDate = function(date) {
    var m = moment(date);
    return m.isValid() ? m.format('ll') : '';
  };

})


.factory('authInterceptor', function($rootScope, $q, $cookies, $location) {
  return {
    // Add authorization token to headers
    request: function(config) {
      config.headers = config.headers || {};
      if ($cookies.get('token')) {
        config.headers.Authorization = 'Bearer ' + $cookies.get('token');
      }
      return config;
    },

    // Intercept 401s and redirect you to login
    responseError: function(response) {
      if (response.status === 401) {
        $location.path('/login');
        // remove any stale tokens
        $cookies.remove('token');
        return $q.reject(response);
      } else {
        return $q.reject(response);
      }
    }
  };
})

.run(function($rootScope, $location, Auth, $translate, $document) {
  // initialize banner display variable
  $rootScope.bannerDisplayed = false;

  // Remove the ugly Facebook appended hash
  // <https://github.com/jaredhanson/passport-facebook/issues/12>
  (function removeFacebookAppendedHash() {
    var hash = $location.hash();
    var path = $location.path();

    if (hash === '_=_') {
      $location.hash('');
    }

    if (path.indexOf('_=_') > -1) {
      $location.path(path.replace('_=_', ''));
      $location.replace(); // replaces in the history
    }
  }());

  var initialize = function() {
    $rootScope.locale = $translate.use();
    $rootScope.specs = {
      cities: ['İstanbul', 'Ankara', 'İzmir'],
      musts: {
        label: $translate.instant('Olmazsa Olmazlar'),
        vals: [{
          label: $translate.instant('Asansör'),
          key: 'elevator'
        }, {
          label: $translate.instant('Otopark'),
          key: 'parking'
        }, {
          label: $translate.instant('Dubleks'),
          key: 'duplex'
        }, {
          label: $translate.instant('Çift banyo'),
          key: 'double_bathroom'
        }, {
          label: $translate.instant('Güvenlik'),
          key: 'security'
        }, {
          label: $translate.instant('Yüzme havuzu'),
          key: 'swimming_pool'
        }, {
          label: $translate.instant('Spor salonu'),
          key: 'gym'
        }, {
          label: $translate.instant('Yeşil alan'),
          key: 'green_land'
        }, {
          label: $translate.instant('Manzara'),
          key: 'scenery'
        }]
      },
      realty_types: {
        label: $translate.instant('Gayrimenkul tipi'),
        vals: [{
          label: $translate.instant('Konut'),
          key: 'house'
        }, {
          label: $translate.instant('İşyeri'),
          key: 'office'
        }, {
          label: $translate.instant('Arsa'),
          key: 'land'
        }]
      },
      building_ages: {
        label: $translate.instant('Bina yaşı'),
        vals: [
        {
          label: $translate.instant('Fark etmez'),
          key: 'any'
        },
        {
          label: '0-5',
          key: '0-5'
        },
        {
          label: '5-15',
          key: '5-15'
        },
        {
          label: '15+',
          key: '15+'
        }]
      },
      floors: {
        label: $translate.instant('Bulunduğu kat'),
        vals: [
        {
          label: $translate.instant('Fark etmez'),
          key: 'any'
        },
        {
          label: $translate.instant('Bodrum'),
          key: 'basement'
        },
        {
          label: $translate.instant('Giriş katı'),
          key: 'entrance'
        },
        {
          label: $translate.instant('Bahçe katı'),
          key: 'garden'
        },
        {
          label: $translate.instant('Ara kat'),
          key: 'interstage'
        },
        {
          label: $translate.instant('Çatı katı'),
          key: 'rooftop'
        }]
      },
      building_types: {
        label: $translate.instant('Yapı tipi'),
        vals: [
        {
          label: $translate.instant('Fark etmez'),
          key: 'any'
        },
        {
          label: $translate.instant('Rezidans'),
          key: 'residence'
        },
        {
          label: $translate.instant('Site'),
          key: 'site'
        },
        {
          label: $translate.instant('Apartman'),
          key: 'apartment'
        },
        {
          label: $translate.instant('Müstakil'),
          key: 'separate'
        }]
      },
      room_counts: {
        label: $translate.instant('Oda sayısı'),
        vals: ["1 + 0", "1 + 1", "2 + 1", "3 + 1", "4 + 1", "5 + 1", "6 + 1"]
      }
    };
  }

  initialize();
  // Redirect to login if route requires auth and the user is not logged in
  $rootScope.$on('$routeChangeStart', function(event, next) {
    $rootScope.currentUserEmail = Auth.getCurrentUser().email;
    initialize();
    if (next.authenticate) {
      Auth.getCurrentUser(function(user) {
        if (!user || _.isEmpty(user)) {
          event.preventDefault();
          $location.path('/login');
        } else if (typeof next.authenticate === 'string') {
          if (user.role !== next.authenticate) {
            event.preventDefault();
            $location.path('/');
          }
        }
      });
    }
  });
})

.run(function($rootScope, $window, $location, $cookies) {
  $rootScope.$on('$viewContentLoaded', function () {
    if (!$rootScope.bannerDisplayed) {
      $rootScope.bannerDisplayed = true;
      $('#banner-modal').modal();
    }

    $window.ga('send', 'pageview', { page: $location.url() });

    $cookies.put('LAST_PATH', $location.path());
  });
});
