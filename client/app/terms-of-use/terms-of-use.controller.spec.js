

describe('Controller: TermsOfUseCtrl', function () {

  // load the controller's module
  beforeEach(module('winvestmentApp'));

  var TermsOfUseCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TermsOfUseCtrl = $controller('TermsOfUseCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
