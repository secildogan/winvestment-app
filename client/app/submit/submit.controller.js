

angular.module('winvestmentApp')
  .controller('SubmitCtrl', function($scope, $localStorage, Auth, $http, $timeout, $location, $route, $rootScope) {
    var oneDay = 1000 * 60 * 60 * 24;
    var currentRequest = angular.copy($localStorage.currentRequest);

    $('body').scrollTop(0);

    $scope.canSeeStep2 = false;
    $scope.canSeeStep3 = false;
    $scope.canFinish = false;

    $scope.showStep = function (step) {
      $scope['step_' + step] = true;
      $scope.checkButtons();
    };

    $scope.checkButtons = function () {
      var d = $scope.data;
      var areaChecks = typeof d.area.min === 'number' && typeof d.area.max === 'number' && d.area.min >= 0 && d.area.max >= d.area.min;
      var priceChecks = typeof d.price.min === 'number' && typeof d.price.max === 'number' && d.price.min >= 0 && d.price.max >= d.price.min;
      if(!_.isEmpty(d.realty_types) && !!d.city && !_.isEmpty(d.districts) && !_.isEmpty(d.neighborhoods) && !_.isEmpty(d.room_counts) && areaChecks && priceChecks)  {
        $scope.canSeeStep2 = true;
      } else {
        $scope.canSeeStep2 = false;
        $scope.step_2 = false;
      }

      if(!!$scope.step_2 && !_.isEmpty(d.floors) && !_.isEmpty(d.building_types) && !_.isEmpty(d.building_ages)) {
        $scope.canSeeStep3 = true;
      } else {
        $scope.canSeeStep3 = false;
        $scope.step_3 = false;
      }

      if(!!$scope.step_3) {
        $scope.canFinish = true;
      } else {
        $scope.canFinish = false;
      }
    };

    if ($localStorage.currentRequest) {
      delete $localStorage.currentRequest.city;
      delete $localStorage.currentRequest.districts;
      delete $localStorage.currentRequest.neighborhoods;
    }

    $scope.clearFields = function () {
      delete $localStorage.currentRequest;
      $route.reload();
    }

    $scope.data = $localStorage.currentRequest;

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
                        $timeout(function () {
                          $scope.showStep(2);
                          $timeout(function () {
                            $scope.showStep(3);
                          }, 0);
                        }, 0);

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
    if (!$scope.data.musts) $scope.data.musts = [];
    if (!$scope.data.building_ages) $scope.data.building_ages = [];
    if (!$scope.data.floors) $scope.data.floors = [];
    if (!$scope.data.building_types) $scope.data.building_types = [];
    if (!$scope.data.dates) $scope.data.dates = {};
    if (!$scope.data.price) {
      $scope.data.price = {
        min: null,
        max: null
      };
    }
    if (!$scope.data.area) {
      $scope.data.area = {
        min: null,
        max: null
      };
    }

    $scope.$watchCollection('data', function () {
      $localStorage.currentRequest = angular.copy($scope.data);
      $scope.checkButtons();
    });

    $scope.$watchCollection('data.dates', function () {
      if (new Date($scope.data.dates.max) < new Date($scope.data.dates.min)) {
        $scope.data.dates.max = new Date(new Date($scope.data.dates.min).getTime() + 7 * oneDay);
      }

      $localStorage.currentRequest = angular.copy($scope.data);
    });

    $scope.$watchCollection('data.price', function () {
      $localStorage.currentRequest = angular.copy($scope.data);
      $scope.checkButtons();
    });

    $scope.$watchCollection('data.area', function () {
      $localStorage.currentRequest = angular.copy($scope.data);
      $scope.checkButtons();
    });

    $scope.$watch('data.neighborhoods', function (neww, old) {
      if (!neww) neww = [];
      if (!old) old = [];

      var oldDistricts = _.filter(old, function (n) {
        return n.charAt(0) === ':' && n.charAt(1) === ':';
      });

      var newDistricts = _.filter(neww, function (n) {
        return n.charAt(0) === ':' && n.charAt(1) === ':';
      });

      angular.copy(newDistricts).forEach(function (d) {
        var ni = newDistricts.indexOf(d);
        var oi = oldDistricts.indexOf(d);
        if (oi > -1) {
          newDistricts.splice(ni, 1);
          oldDistricts.splice(oi, 1);
        }
      });


      if (newDistricts.length || oldDistricts.length) {
        var newNeighborhoods = angular.copy($scope.data.neighborhoods);
        if (!newNeighborhoods) { newNeighborhoods = []; }

        newDistricts.forEach(function (d) {
          var i = _.findIndex($scope.allNeighborhoods, function (item) {
            return item.district === d.substr(2);
          });

          if (i > -1) {
            $scope.allNeighborhoods[i].neighborhoods.forEach(function (di) {
              if (newNeighborhoods.indexOf(di) === -1) {
                newNeighborhoods.push(di);
              }
            });
          }
        });

        oldDistricts.forEach(function (d) {
          var i = _.findIndex($scope.allNeighborhoods, function (item) {
            return item.district === d.substr(2);
          });

          if (i > -1) {
            $scope.allNeighborhoods[i].neighborhoods.forEach(function (di) {
              var dii = newNeighborhoods.indexOf(di);
              if (dii > -1) {
                newNeighborhoods.splice(dii, 1);
              }
            });
          }
        });

        $scope.data.neighborhoods = newNeighborhoods;
      }

      $scope.checkButtons();
    });

    $scope.$watch('data.city', function (n) {
      if (n !== undefined) {
        $http.get('/api/locations/' + n).success(function (data) {
          $scope.allDistricts = data;
          $scope.allNeighborhoods = [];
          delete $scope.data.districts;
          delete $scope.data.neighborhoods;
        }).finally(function () {
          $scope.districtsReceived = true;
        });
      }

      $scope.checkButtons();
    });

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

    $scope.$watch('data.districts', function (n) {
      if (n !== undefined) {
        $http.post('/api/locations/' + $scope.data.city, { districts: n }).success(function (data) {
          $scope.allNeighborhoods = $scope.fixDuplicateNeighborhoods(data);
          delete $scope.data.neighborhoods;
        }).finally(function () {
          $scope.neighborhoodsReceived = true;
        });
      }

      $scope.checkButtons();
    });

    $scope.today = new Date();

    if (!$scope.data.dates.min || new Date($scope.data.dates.min) < $scope.today) $scope.data.dates.min = $scope.today;
    if (!$scope.data.dates.max  || new Date($scope.data.dates.max) < $scope.data.dates.min) $scope.data.dates.max = new Date(new Date($scope.data.dates.min).getTime() + 7 * oneDay);

    $scope.data.dates.min = new Date($scope.data.dates.min);
    $scope.data.dates.max = new Date($scope.data.dates.max);

    $scope.toggle = function(item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }

      $localStorage.currentRequest = angular.copy($scope.data);
      $scope.checkButtons();
    };

    $scope.exists = function(item, list) {
      return list.indexOf(item) > -1;
    };

    $scope.isIndeterminate = function(model) {
      return ($scope.data[model].length !== 0 &&
        $scope.data[model].length !== $rootScope.specs[model].vals.length);
    };

    $scope.isAllChecked = function (model) {
      return $scope.data[model].length === $rootScope.specs[model].vals.length;
    };

    $scope.toggleAll = function(model) {
      if ($scope.data[model].length === $rootScope.specs[model].vals.length) {
        $scope.data[model] = [];
      } else if ($scope.data[model].length === 0 || $scope.data[model].length > 0) {
        $scope.data[model] = $rootScope.specs[model].vals.map(function (n) { return n.key; }).slice(0);
      }
    };

    $scope.addDots = function (intNum) {
      return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1.');
    }

    var diffArray = function (a1, a2) {
      return a1.filter(function(i) { return a2.indexOf(i) < 0; });
    };

    $scope.sendForm = function (form) {
      if (Auth.isLoggedIn()) {
        var toSend = angular.copy($scope.data);
        // reformat neighborhoods
        if (!_.isEmpty(toSend.neighborhoods)) {
          var neighborhoodsObj = {};

          // check if whole district is selected
          var districts = _.filter(toSend.neighborhoods, function (n) {
            return n.charAt(0) === ':' && n.charAt(1) === ':';
          });

          districts.forEach(function (d) {
            var i = _.findIndex($scope.allNeighborhoods, function (obj) {
              return obj.district === d.substr(2);
            });

            var allNCopy = $scope.allNeighborhoods[i].neighborhoods.slice(0);
            var toPush = '::' + $scope.allNeighborhoods[i].district;
            allNCopy.unshift(toPush);
            neighborhoodsObj[$scope.allNeighborhoods[i].district] = allNCopy;
            toSend.neighborhoods = diffArray(toSend.neighborhoods, allNCopy);
          });

          // got rid of districts, now grouping separate neighborhoods under their districts
          toSend.neighborhoods.forEach(function (n) {
            var i = _.findIndex($scope.allNeighborhoods, function (obj) {
              return obj.neighborhoods.indexOf(n) > -1;
            });

            if (i > -1) {
              if (!neighborhoodsObj[$scope.allNeighborhoods[i].district]) {
                neighborhoodsObj[$scope.allNeighborhoods[i].district] = [];
              }

              neighborhoodsObj[$scope.allNeighborhoods[i].district].push(n);
            }
          });

          toSend.neighborhoods = neighborhoodsObj;
        }


        $http.post('/api/submissions', toSend).success(function (res) {
          delete $localStorage.currentRequest;
          $route.reload();
          $timeout(function () {
            $location.path('/success/' + res._id);
          });
        });
      } else {
        $('#must-login-modal').modal();
      }
    }
  });
