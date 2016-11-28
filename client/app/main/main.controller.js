

angular.module('winvestmentApp')
  .controller('MainController', function($scope, $localStorage, $http, $timeout, $interval, $translate, Notification, $location) {
    $scope.stats = [{
      base: 0,
      hourlyRate: 3
    }, {
      base: 50,
      hourlyRate: 11

    }, {
      base: 300,
      hourlyRate: 23
    }];

    var calculateStats = function() {
      $scope.stats.forEach(function(obj) {
        var a = new Date().getTime();
        var hours = a / (1000 * 60 * 60);
        var today = parseInt(hours, 10);
        obj.val = obj.base + (today - 409215) * obj.hourlyRate;
      });
    }();

    $scope.fixDuplicateNeighborhoods = function (an) {
      var ns = [];
      an.forEach(function (a) {
        a.neighborhoods.forEach(function (n, i) {
          var cnt = 0;
          while(ns.indexOf(a.neighborhoods[i]) > -1 && cnt < 10) {
            a.neighborhoods[i] += '.';
            cnt += 1;
          }

          ns.push(a.neighborhoods[i]);
        });
      });

      return an;
    };

    $scope.submit = function(form) {
      if (form.$valid) {
        $http.post('/api/contacts', $scope.contact).success(function() {
          Notification.success($translate.instant('Mesajınız bize ulaştı. En kısa zamanda size dönüş sağlanacaktır.'));
        }).error(function() {
          Notification.error($translate.instant('Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.'));
        })
      }
    }

    $scope.tabState = true;

    $scope.startHowItWorks = function() {
      $scope.selectedHowItWorks = 0;
      $timeout(function() {
        $scope.selectedHowItWorks++;
      }, 5000);

      var howItWorksInterval = $interval(function() {
        if ($scope.selectedHowItWorks >= 4) {
          $scope.selectedHowItWorks = 0;
        } else {
          $scope.selectedHowItWorks++;
        }
      }, 5000);

      $scope.$watch('tabState', function() {
        $interval.cancel(howItWorksInterval);
        howItWorksInterval = $interval(function() {
          if ($scope.selectedHowItWorks >= 4) {
            $scope.selectedHowItWorks = 0;
          } else {
            $scope.selectedHowItWorks++;
          }
        }, 5000);
      });
    };

    $scope.$on('elementFirstScrolledIntoView', function() {
      $scope.startHowItWorks();
    });


    var currentRequest = angular.copy($localStorage.currentRequest);

    if ($localStorage.currentRequest) {
      delete $localStorage.currentRequest.city;
      delete $localStorage.currentRequest.districts;
      delete $localStorage.currentRequest.neighborhoods;
    }

    $scope.data = $localStorage.currentRequest;

    $scope.showNeighborhoodsSelect = true;
    $scope.showDistrictsSelect = true;
    if (currentRequest) {
      if (currentRequest.city) {
        $scope.data.city = currentRequest.city;

        var cntD = 0;
        var initDistrictInterval = setInterval(function () {
          cntD++;
          if (cntD >= 50) clearTimeout(initDistrictInterval);
          if ($scope.districtsReceived) {
            clearTimeout(initDistrictInterval);
            if (currentRequest.districts) {
              $timeout(function () {
                $scope.data.districts = currentRequest.districts;
                var cntN = 0;
                var initNeighborhoodInterval = setInterval(function () {
                  cntN++;
                  if (cntN >= 50) clearTimeout(initNeighborhoodInterval);
                  if ($scope.neighborhoodsReceived) {
                    clearTimeout(initNeighborhoodInterval);
                    if (currentRequest.neighborhoods) {
                      $timeout(function () {
                        $scope.data.neighborhoods = currentRequest.neighborhoods;
                      }, 0);
                    }
                  }
                }, 200);
              });
            }
          }
        }, 200);
      }
    }

    if (!$scope.data) $scope.data = {};
    if (!$scope.data.price) {
      $scope.data.price = {
        min: 200000,
        max: 2000000
      };
    }

    $scope.$watchCollection('data', function() {
      $localStorage.currentRequest = angular.copy($scope.data);
    });

    $scope.$watchCollection('data.price', function() {
      $localStorage.currentRequest = angular.copy($scope.data);
    });

    $scope.$watch('data.neighborhoods', function(neww, old) {
      var oldDistricts = _.filter(old, function(n) {
        return n.charAt(0) === ':' && n.charAt(1) === ':';
      });

      var newDistricts = _.filter(neww, function(n) {
        return n.charAt(0) === ':' && n.charAt(1) === ':';
      });

      angular.copy(newDistricts).forEach(function(d) {
        var ni = newDistricts.indexOf(d);
        var oi = oldDistricts.indexOf(d);
        if (oi > -1) {
          newDistricts.splice(ni, 1);
          oldDistricts.splice(oi, 1);
        }
      });


      if (newDistricts.length || oldDistricts.length) {
        var newNeighborhoods = angular.copy($scope.data.neighborhoods);
        newDistricts.forEach(function(d) {
          var i = _.findIndex($scope.allNeighborhoods, function(item) {
            return item.district === d.substr(2);
          });

          if (i > -1) {
            $scope.allNeighborhoods[i].neighborhoods.forEach(function(di) {
              if (newNeighborhoods.indexOf(di) === -1) {
                newNeighborhoods.push(di);
              }
            });
          }
        });

        oldDistricts.forEach(function(d) {
          var i = _.findIndex($scope.allNeighborhoods, function(item) {
            return item.district === d.substr(2);
          });

          if (i > -1) {
            $scope.allNeighborhoods[i].neighborhoods.forEach(function(di) {
              var dii = newNeighborhoods.indexOf(di);
              if (dii > -1) {
                newNeighborhoods.splice(dii, 1);
              }
            });
          }
        });

        $scope.data.neighborhoods = newNeighborhoods;
      }
    });

    $scope.addDots = function(intNum) {
      return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1.');
    }

    $scope.$watch('data.city', function(n) {
      if (n !== undefined) {
        $http.get('/api/locations/' + n).success(function(data) {
          $scope.allDistricts = data;
          $scope.allNeighborhoods = [];
          delete $scope.data.districts;
          delete $scope.data.neighborhoods;
        }).finally(function() {
          $scope.districtsReceived = true;
        });
      }
    });

    $scope.$watch('data.districts', function(n) {
      if (n !== undefined) {
        $http.post('/api/locations/' + $scope.data.city, {
          districts: n
        }).success(function(data) {
          $scope.allNeighborhoods = $scope.fixDuplicateNeighborhoods(data);
          delete $scope.data.neighborhoods;
        }).finally(function() {
          $scope.neighborhoodsReceived = true;
        });
      }
    });
  });
