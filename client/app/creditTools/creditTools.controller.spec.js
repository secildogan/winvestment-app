

describe('Controller: CreditToolsCtrl', function () {

  // load the controller's module
  beforeEach(module('winvestmentApp'));

  var CreditToolsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreditToolsCtrl = $controller('CreditToolsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
