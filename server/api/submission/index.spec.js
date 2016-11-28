'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var submissionCtrlStub = {
  index: 'submissionCtrl.index',
  show: 'submissionCtrl.show',
  create: 'submissionCtrl.create',
  update: 'submissionCtrl.update',
  destroy: 'submissionCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var submissionIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './submission.controller': submissionCtrlStub
});

describe('Submission API Router:', function() {

  it('should return an express router instance', function() {
    submissionIndex.should.equal(routerStub);
  });

  describe('GET /api/submissions', function() {

    it('should route to submission.controller.index', function() {
      routerStub.get
        .withArgs('/', 'submissionCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/submissions/:id', function() {

    it('should route to submission.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'submissionCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/submissions', function() {

    it('should route to submission.controller.create', function() {
      routerStub.post
        .withArgs('/', 'submissionCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/submissions/:id', function() {

    it('should route to submission.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'submissionCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/submissions/:id', function() {

    it('should route to submission.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'submissionCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/submissions/:id', function() {

    it('should route to submission.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'submissionCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
