function createNewApp(startWParent, stopWParent, prevDestroy) {
  return new Marionette.Toolkit.App({
    childApps: {
      myChildAppOne: {
        AppClass: Marionette.Toolkit.App,
        startWithParent: startWParent,
        stopWithParent: stopWParent,
        preventDestroy: prevDestroy
      }
    }
  });
}

describe('app-lifecycle-options', function() {
  describe('when starting the application', function() {
    it('should start automatically with startAfterInitialized set to true', function() {
      this.autoStartApp = new Marionette.Toolkit.App({
        'startAfterInitialized': true
      });
      expect(this.autoStartApp._isRunning).to.equal(true);
    });

    describe('and adding a childApp with startWithParent = true after parent has started', function() {
      it('should start the childApp', function() {
        this.myApp = new Marionette.Toolkit.App();
        this.myApp.start();
        this.myApp.addChildApp('myAddedChild', Marionette.Toolkit.App, {
          startWithParent: true
        });

        const test = this.myApp.getChildApp('myAddedChild');
        expect(test.isRunning()).to.equal(true);
      });
    });
  });

  describe('when starting the application with child apps', function() {
    describe('and startWithParent = false', function() {
      it('should not start the childApp on parent start', function() {
        this.myApp = createNewApp(false, false, false);
        this.myApp.start();
        const test = this.myApp.getChildApp('myChildAppOne').isRunning();
        expect(test).to.equal(false);
      });
    });

    describe('and startWithParent = true', function() {
      it('should start the childApp on parent start', function() {
        this.myApp = createNewApp(true, false, false);
        this.myApp.start();

        const test = this.myApp.getChildApp('myChildAppOne').isRunning();
        expect(test).to.equal(true);
      });
    });
  });

  describe('when stopping the application with child apps', function() {
    describe('and stopWithParent = false', function() {
      it('should not stop the childApp on parent stop', function() {
        this.myApp = createNewApp(true, false, false);
        this.myApp.start();
        this.myApp.stop();

        const test = this.myApp.getChildApp('myChildAppOne').isRunning();
        expect(test).to.equal(true);
      });
    });

    describe('and stopWithParent = true', function() {
      it('should stop the childApp on parent stop', function() {
        this.myApp = createNewApp(true, true, false);
        this.myApp.start();
        this.myApp.stop();
        const test = this.myApp.getChildApp('myChildAppOne').isRunning();
        expect(test).to.equal(false);
      });
    });
  });

  describe('when destroying the application with child apps', function() {
    describe('and preventDestroy = false', function() {
      it('should not destroy the childApp on parent destroy', function() {
        this.myApp = createNewApp(true, false, false);
        const test = this.myApp.getChildApp('myChildAppOne');
        this.myApp.destroy();
        expect(test.isDestroyed()).to.equal(true);
      });
    });

    describe('and preventDestroy = true', function() {
      it('should destroy the childApp on parent destroy', function() {
        this.myApp = createNewApp(true, false, true);
        const test = this.myApp.getChildApp('myChildAppOne');
        this.myApp.destroy();
        expect(test.isDestroyed()).to.equal(false);
      });
    });
  });

  describe('when removing a child app from the application, the child app', function() {
    it('should not be destroyed if preventDestroy = true', function() {
      this.myApp = createNewApp(true, false, true);
      const test = this.myApp.removeChildApp('myChildAppOne');
      expect(test.isDestroyed()).to.equal(false);
    });

    it('should be destroyed if preventDestroy = false', function() {
      this.myApp = createNewApp(true, false, false);
      const test = this.myApp.removeChildApp('myChildAppOne');
      expect(test.isDestroyed()).to.equal(true);
    });
  });

  describe('when restarting the application with child apps', function() {
    describe('and a childApp has restartWithParent = true', function() {
      it('should stop and start the specific childApp', function() {
        const childApps = {
          cA1: {
            AppClass: Marionette.Toolkit.App,
            restartWithParent: true
          }
        };

        const myApp = new Marionette.Toolkit.App({ childApps: childApps });

        myApp.start();

        const stopSpy = sinon.spy(myApp.getChildApp('cA1'), 'stop');
        const startSpy = sinon.spy(myApp.getChildApp('cA1'), 'start');

        myApp.restart();

        expect(stopSpy).to.be.called.once;
        expect(startSpy).to.be.called.once;
      });
    });

    describe('and a childApp has restartWithParent = false', function() {
      it('should not stop or start the specific childApp', function() {
        const childApps = {
          cA1: {
            AppClass: Marionette.Toolkit.App,
            stopWithParent: false
          }
        };

        const myApp = new Marionette.Toolkit.App({ childApps: childApps });

        myApp.start();

        const stopSpy = sinon.spy(myApp.getChildApp('cA1'), 'stop');
        const startSpy = sinon.spy(myApp.getChildApp('cA1'), 'start');

        myApp.restart();

        expect(stopSpy).to.not.be.called;
        expect(startSpy).to.not.be.called;
      });
    });
  });
});
