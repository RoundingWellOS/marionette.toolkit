describe('App-Lifecycle', function () {
  beforeEach(function () {
    this.myApp = new Marionette.Toolkit.App();
  });

  describe('when starting the application', function () {
    beforeEach(function () {
      this.myApp.start();
    });

    it('should be successfully started', function () {
      expect(this.myApp._isRunning).to.equal(true);
    });

    describe('when the application has already been started', function () {
      it('should not start the app again', function () {
        this.myApp.start();
        // TODO:  Check needed here?
      });
    });

    describe('and stopping the application', function () {
      it('should stop the application', function () {
        this.myApp.stop();
        expect(this.myApp._isRunning).to.equal(false);
      });

      it('should NOT stop the application if the application has already been stopped', function () {
        this.myApp.stop();
        this.myApp.stop();
        // TODO:  Check needed here?
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
