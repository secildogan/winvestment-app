

angular.module('winvestmentApp')
.controller('MustLoginModalCtrl', function ($scope, $location, Auth) {
  $scope.login_user = {};
  $scope.signup_user = {};
  $scope.login_errors = {};
  $scope.signup_errors = {};

  $scope.login = function (form) {
    $scope.submitted = true;

    if (form.$valid) {
      Auth.login({
        email: $scope.login_user.email,
        password: $scope.login_user.password
      })
      .then(function (rs) {
        $('#must-login-modal').modal('hide');
      })
      .catch(function (err) {
        $scope.login_errors.other = err.message;
      });
    }
  };

  $scope.register = function (form) {
    $scope.submitted = true;

    if (form.$valid) {
      Auth.createUser({
        name: $scope.signup_user.name,
        email: $scope.signup_user.email,
        phone: $scope.signup_user.phone,
        password: $scope.signup_user.password
      })
      .then(function () {
        $('#must-login-modal').modal('hide');
      })
      .catch(function (err) {
        err = err.data;
        $scope.signup_errors = {};

        // Update validity of form fields that match the mongoose errors
        angular.forEach(err.errors, function (error, field) {
          form[field].$setValidity('mongoose', false);
          $scope.signup_errors[field] = error.message;
        });
      });
    }
  };
});
