

describe('Controller: JobApplicationCtrl', function () {

  // load the controller's module
  beforeEach(module('winvestmentApp'));

  var JobApplicationCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JobApplicationCtrl = $controller('JobApplicationCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
