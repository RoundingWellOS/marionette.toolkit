import '../../src/marionette.toolkit';

describe('App-running-events', function() {
  beforeEach(function() {
    this.fooStub = this.sinon.stub();
    this.barStub = this.sinon.stub();
    this.myApp = new Marionette.Toolkit.App();
  });

  describe('when starting and stopping an app', function() {
    beforeEach(function() {
      this.myApp.on('foo', this.fooStub);
      this.myApp.start();
      this.myApp.on('bar', this.barStub);
    });

    it('should work with events created before and after start', function() {
      this.myApp.trigger('foo');
      this.myApp.trigger('bar');
      expect(this.fooStub).to.have.been.calledOnce;
      expect(this.barStub).to.have.been.calledOnce;
    });

    it('should remove only events added after start', function() {
      this.myApp.stop();
      this.myApp.trigger('foo');
      this.myApp.trigger('bar');
      expect(this.fooStub).to.have.been.calledOnce;
      expect(this.barStub).to.have.not.been.called;
    });

  });

  describe('when listening to an event on a model', function() {
    beforeEach(function() {
      this.myModel = new Backbone.Model();
      this.myApp.listenTo(this.myModel, 'foo', this.fooStub);
      this.myApp.start();
      this.myApp.listenTo(this.myModel, 'bar', this.barStub);
    });

    it('should work with events created before and after start', function() {
      this.myModel.trigger('foo');
      this.myModel.trigger('bar');
      expect(this.fooStub).to.have.been.calledOnce;
      expect(this.barStub).to.have.been.calledOnce;
    });

    it('should only work with events created before start', function() {
      this.myApp.stop();
      this.myModel.trigger('foo');
      this.myModel.trigger('bar');
      expect(this.fooStub).to.have.been.calledOnce;
      expect(this.barStub).to.have.not.been.called;
    });

  });

});
