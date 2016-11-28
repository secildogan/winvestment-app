

angular.module('winvestmentApp')
  .controller('JobApplicationCtrl', function ($scope, $http, Notification, $translate) {
    $scope.sendApplication = function (form) {
      if (form.$valid) {
        $http.post('/api/contacts/job', $scope.application).success(function () {
          Notification.success($translate.instant('Başvurunuz bize ulaştı. En kısa zamanda size dönüş sağlanacaktır.'));
        }).error(function () {
          Notification.error($translate.instant('Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.'));
        });
      }
    }
  });
