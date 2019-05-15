import _ from 'underscore';
import App from '../../src/app';

describe('App-Lifecycle', function() {
  beforeEach(function() {
    this.beforeStartStub = this.sinon.stub();
    this.startStub = this.sinon.stub();
    this.beforeStopStub = this.sinon.stub();
    this.stopStub = this.sinon.stub();
    this.destroyStub = this.sinon.stub();
    this.onChangeStub = this.sinon.stub();
    this.myApp = new App({
      stateEvents: {
        'change': this.onChangeStub
      }
    });
    this.myApp.on('before:start', this.beforeStartStub);
    this.myApp.on('start', this.startStub);
    this.myApp.on('before:stop', this.beforeStopStub);
    this.myApp.on('stop', this.stopStub);
    this.myApp.on('destroy', this.destroyStub);
  });

  describe('when starting the application', function() {
    beforeEach(function() {
      this.sinon.spy(this.myApp, 'delegateStateEvents');
      this.myApp.start();
    });

    it('should trigger before:start event', function() {
      expect(this.beforeStartStub).to.have.been.calledOnce;
    });

    it('should delegate state events', function() {
      expect(this.myApp.delegateStateEvents).to.be.calledOnce;
    });

    it('should trigger start event', function() {
      expect(this.startStub).to.have.been.calledOnce;
    });

    it('should be successfully started', function() {
      expect(this.myApp._isRunning).to.equal(true);
    });

    describe('when the application has already been started', function() {
      it('should not start the app again and not trigger before:start twice', function() {
        this.myApp.start();
        expect(this.beforeStartStub).to.have.not.been.calledTwice;
      });

      it('should not start the app again and not trigger start twice', function() {
        this.myApp.start();
        expect(this.startStub).to.have.not.been.calledTwice;
      });
    });

    describe('when stopping the application', function() {
      beforeEach(function() {
        this.myApp.stop();
      });

      it('should stop the application', function() {
        expect(this.myApp._isRunning).to.equal(false);
      });

      it('should call before:stop', function() {
        expect(this.beforeStopStub).to.have.been.calledOnce;
      });

      it('should call stop', function() {
        expect(this.stopStub).to.have.been.calledOnce;
      });

      it('should NOT stop the application if the application has already been stopped and not call before:stop twice', function() {
        this.myApp.stop();
        expect(this.beforeStopStub).to.have.not.been.calledTwice;
      });

      it('should NOT stop the application if the application has already been stopped and not call stop twice', function() {
        expect(this.stopStub).to.have.not.been.calledTwice;
      });
    });


    describe('when triggering a stateEvent after app stop', function() {
      it('should not call the stateEvent', function() {
        this.myApp.stop();
        this.myApp.setState('foo', 'bar');
        expect(this.onChangeStub).to.have.not.been.called;
      });
    });


    describe('when stop listener is a running listener', function() {
      beforeEach(function() {
        this.stopRunStub = this.sinon.stub();
        this.myApp.on('stop', this.stopRunStub);
        this.myApp.stop();
      });

      it('should trigger the stop event', function() {
        expect(this.stopRunStub).to.have.been.calledOnce;
      });
    });
  });

  describe('when restarting the app', function() {
    beforeEach(function() {
      this.myApp.start({
        state: { 'foo': 'bar' }
      });
    });

    it('should start with _isRestarting flag set to false', function() {
      expect(this.myApp.isRestarting()).to.equal(false);
    });

    it('should be stopped', function() {
      this.myApp.restart();

      expect(this.stopStub).to.have.been.calledOnce;
    });

    it('should be started again', function() {
      expect(this.startStub).to.have.been.calledOnce;

      this.myApp.restart();

      expect(this.startStub).to.have.been.calledTwice;
    });

    it('should maintain the app\'s previous state', function() {
      expect(this.beforeStartStub).to.be.calledWith({ state: { foo: 'bar' } });

      this.myApp.setState('foo', 'baz');

      this.myApp.restart();

      expect(this.beforeStartStub).to.be.calledWith({ state: { foo: 'baz' } });
    });

    it('should set isRestarting() during restart process', function() {
      const newApp = App.extend({
        onBeforeStop() {
          expect(this.isRestarting()).to.equal(true);
        }
      });

      this.myApp = new newApp();
      this.myApp.start();
      this.myApp.restart();

      expect(this.myApp.isRestarting()).to.equal(false);
    });
  });

  describe('when an application is yet to be destroyed', function() {
    it('should have isDestroyed() to return false', function() {
      expect(this.myApp.isDestroyed()).to.equal(false);
    });
  });

  describe('when destroying an application', function() {
    beforeEach(function() {
      this.myApp.start();
      this.myApp.destroy();
    });

    it('should be stopped', function() {
      expect(this.stopStub).to.have.been.calledOnce;
    });

    it('should successfully be destroyed', function() {
      expect(this.myApp.isDestroyed()).to.equal(true);
    });

    describe('and restarting the destroyed application', function() {
      it('should throw an error', function() {
        expect(_.bind(function() {
          this.myApp.start();
        }, this)).to.throw('App has already been destroyed and cannot be used.');
      });
    });

    describe('and destroying it again', function() {
      beforeEach(function() {
        this.myApp.destroy();
      });

      it('should not destroy', function() {
        expect(this.destroyStub).to.have.not.been.calledTwice;
      });
    });
  });
});
