

describe('Controller: SuccessCtrl', function () {

  // load the controller's module
  beforeEach(module('winvestmentApp'));

  var SuccessCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SuccessCtrl = $controller('SuccessCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
