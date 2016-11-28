

angular.module('winvestmentApp')
  .controller('ContactCtrl', function ($scope, $http, Notification, $translate) {
    $scope.submit = function (form) {
      if (form.$valid) {
        $http.post('/api/contacts', $scope.contact).success(function () {
          Notification.success($translate.instant('Mesajınız bize ulaştı. En kısa zamanda size dönüş sağlanacaktır.'));
        }).error(function () {
          Notification.error($translate.instant('Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.'));
        });
      }
    }
  });
