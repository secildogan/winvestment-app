

angular.module('winvestmentApp')
  .controller('SettingsCtrl', function($scope, User, Auth, Notification, $translate, $http) {
    $scope.errors = {};
    Auth.getCurrentUser(function (u) {
      $scope.user = _.pick(u, ['name', 'email', 'phone']);
    });

    $scope.changePassword = function(form) {
      if (form.$valid) {
        Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword)
          .then(function() {
            Notification.success($translate.instant('Şifreniz başarıyla değiştirildi.'));
          })
          .catch(function() {
            form.oldPassword.$setValidity('mongoose', false);
            $scope.errors.password = $translate.instant('Girdiğiniz şifre yanlış.');
            $scope.message = '';
          });
      }
    };

    $scope.saveInfo = function(form) {
      if (form.$valid) {
        $http.put('/api/users/me', _.pick($scope.user, ['name', 'email', 'phone'])).success(function () {
          Notification.success($translate.instant('Bilgileriniz başarıyla güncellendi.'));
          Auth.refreshCurrentUser();
        });
      }
    }
  });
