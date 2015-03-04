import AbstractApp from '../../src/abstract-app';

describe('App-Lifecycle', function () {
  beforeEach(function () {
    this.beforeStartStub = this.sinon.stub();
    this.startStub = this.sinon.stub();
    this.beforeStopStub = this.sinon.stub();
    this.stopStub = this.sinon.stub();
    this.myApp = new AbstractApp();
    this.myApp.on('before:start', this.beforeStartStub);
    this.myApp.on('start', this.startStub);
    this.myApp.on('before:stop', this.beforeStopStub);
    this.myApp.on('stop', this.stopStub);
  });

  describe('when starting the application', function () {
    beforeEach(function () {
      this.myApp.start();
    });

    it('should trigger before:start event', function () {
      expect(this.beforeStartStub).to.have.been.calledOnce;
    });

    it('should trigger start event', function () {
      expect(this.startStub).to.have.been.calledOnce;
    });

    it('should be successfully started', function () {
      expect(this.myApp._isRunning).to.equal(true);
    });

    describe('when the application has already been started', function () {
      it('should not start the app again and not trigger before:start twice', function () {
        this.myApp.start();
        expect(this.beforeStartStub).to.have.not.been.calledTwice;
      });

      it('should not start the app again and not trigger start twice', function () {
        this.myApp.start();
        expect(this.startStub).to.have.not.been.calledTwice;
      });
    });

    describe('and stopping the application', function () {
      beforeEach(function() {
        this.myApp.stop();
      });

      it('should stop the application', function () {
        expect(this.myApp._isRunning).to.equal(false);
      });

      it('should call before:stop', function () {
        expect(this.beforeStopStub).to.have.been.calledOnce;
      });

      it('should call stop', function () {
        expect(this.stopStub).to.have.been.calledOnce;
      });

      it('should NOT stop the application if the application has already been stopped and not call before:stop twice', function () {
        this.myApp.stop();
        expect(this.beforeStopStub).to.have.not.been.calledTwice;
      });

      it('should NOT stop the application if the application has already been stopped and not call stop twice', function () {
        expect(this.stopStub).to.have.not.been.calledTwice;
      });
    });
  });

  describe('when destroying an application', function () {
    beforeEach(function () {
      this.myApp.start();
    });

    it('should have isDestroyed() to return false PRIOR to destroying', function () {
      expect(this.myApp.isDestroyed()).to.equal(false);
    });

    it('should successfully be destroyed', function () {
      this.myApp.destroy();
      expect(this.myApp.isDestroyed()).to.equal(true);
    });

    describe('and restarting the destroyed application', function () {
      it('should throw an error', function () {
        this.myApp.destroy();
        expect(_.bind(function(){
          this.myApp.start();
        }, this)).to.throw('App has already been destroyed and cannot be used.');
      });
    });
  });

});
