import '../../src/marionette.toolkit';

describe('App', function() {
  beforeEach(function() {

  });

  describe('when starting an app', function() {
    beforeEach(function() {
      this.fooStub = this.sinon.stub();
      this.barStub = this.sinon.stub();
      this.myApp = new Marionette.Toolkit.App();

      this.myApp.on('foo', this.fooStub);
      this.myApp.start();
      this.myApp.on('bar', this.barStub);

      this.myApp.trigger('foo');
      this.myApp.trigger('bar');
    });

    it('should work with events created before and after start', function() {
      expect(this.fooStub).to.have.been.calledOnce;
      expect(this.barStub).to.have.been.calledOnce;
    });

    describe('and then stopping the app', function() {
      beforeEach(function() {
        this.myApp.stop();

        this.myApp.trigger('foo');
        this.myApp.trigger('bar');
      });

      it('should remove only events added after start', function() {
        expect(this.fooStub).to.have.been.called.twice;
        expect(this.barStub).to.have.been.calledOnce;
      });
    });
  });

});
