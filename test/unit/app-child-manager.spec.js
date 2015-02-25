import _ from 'underscore';
import '../../src/marionette.toolkit';


describe('App Manager', function() {
  beforeEach(function() {
    this.myApp = new Marionette.Toolkit.App();
  });

  describe('when instantiating', function() {

    it('should be an instanceOf Marionette.Toolkit.App', function() {
      expect(this.myApp).to.be.an.instanceOf(Marionette.Toolkit.App);
    });

    describe('without declared child apps', function() {
      describe('childApps object', function() {

        it('should not be created', function() {
            expect(this.myApp.childApps).to.be.undefined;
        });

      });

      describe('_childApps object', function() {

        it('should be created but empty', function() {
          expect(this.myApp.childApps).to.not.be.null;
          expect(Object.keys(this.myApp._childApps)).to.have.length(0);
        });

      });

      describe('_initChildApps', function() {

        it('should not have error', function() {
          this.sinon.spy(this.myApp, '_initChildApps');
          this.myApp._initChildApps();

          expect(this.myApp._initChildApps.called);
          expect(_.bind(this.myApp._initChildApps, this.myApp)).to.not.throw(Error);
        });
      });

      describe('addChildApps', function() {
        beforeEach(function() {
          this.sinon.spy(this.myApp, 'addChildApps');

          this.childApps = {
            cA1: Marionette.Toolkit.App,
            cA2: Marionette.Toolkit.App,
            cA3: Marionette.Toolkit.App
          };

          this.myApp.addChildApps();
        });

        it('should be called', function() {
          expect(this.myApp.addChildApps.called).to.be.true;
        });

        it('should have no arguments', function() {
          expect(this.myApp.addChildApps.calledWith(this.childApps)).to.be.false;
        });

      });

      describe('addChildApp function', function() {

        it('should raise an error message', function() {
          var errMessage = 'App build failed.  Incorrect configuration.';

          // Bind function because `this` needs to be the other describe block
          expect(_.bind(this.myApp.addChildApp, this.myApp)).to.throw(errMessage);
        });

      });

    });

    describe('with declared child apps', function() {
      describe('constructor', function() {
        beforeEach(function() {
          var childApps = {
            cA1: Marionette.Toolkit.App,
            cA2: Marionette.Toolkit.App,
            cA3: Marionette.Toolkit.App
          };

          this.myApp = new Marionette.Toolkit.App({ childApps: childApps });
        });

        it('should create childApps and _childApps attributes with childApps inside', function() {
          expect(_.keys(this.myApp.childApps)).to.have.length(3);
          expect(_.keys(this.myApp._childApps)).to.have.length(3);
        });

      });

      describe('_initChildApps', function() {
        it('should accept a hash', function() {
          var childApps = {
            cA1: Marionette.Toolkit.App,
            cA2: Marionette.Toolkit.App,
            cA3: Marionette.Toolkit.App
          };
          this.sinon.spy(this.myApp, '_initChildApps');
          this.myApp = new Marionette.Toolkit.App({ childApps: childApps });

          expect(this.myApp._initChildApps.called);
          expect(_.keys(this.myApp._childApps)).to.have.length(3);
        });

        it('should accept a function', function() {
          var childApps = function(){
            return {
              cA1: Marionette.Toolkit.App,
              cA2: Marionette.Toolkit.App
            };
          };

          this.myApp = new Marionette.Toolkit.App({ childApps: childApps });

          expect(_.keys(this.myApp._childApps)).to.have.length(2);

        });

      });

    });

  });

  describe('addChildApps', function() {
    beforeEach(function() {
      this.sinon.spy(this.myApp, 'addChildApps');

      this.childApps = {
        cA1: Marionette.Toolkit.App,
        cA2: Marionette.Toolkit.App,
        cA3: Marionette.Toolkit.App
      };

      this.myApp.addChildApps(this.childApps);
    });

    it('should be called', function() {
      expect(this.myApp.addChildApps.called).to.be.true;
    });

    it('should have arguments', function() {
      expect(this.myApp.addChildApps.calledWith(this.childApps)).to.be.true;
    });

  });

  describe('_ensureAppIsUnique', function() {
    beforeEach(function() {
      this.childApps = {
        cA1: Marionette.Toolkit.App,
        cA2: Marionette.Toolkit.App,
      };

      this.secondChildAppName = 'cA2';

      this.thirdChildAppName = 'cA3';

      this.errMessage = 'A child App with that name has already been added.';

      this.myApp = new Marionette.Toolkit.App();

      this.spy = sinon.spy(this.myApp, '_ensureAppIsUnique');

      this.myApp.addChildApps(this.childApps);
    });

    it('should throw error if a duplicate child exists', function() {
      expect(_.bind(function(){
        this.myApp._ensureAppIsUnique(this.secondChildAppName);
      }, this)).to.throw(this.errMessage);

      expect(this.spy.callCount === 3).to.be.true;
    });

    it('should not throw an error if new child app is not a duplicate', function() {
      expect(_.bind(function(){
        this.myApp._ensureAppIsUnique(this.thirdChildAppName);
      }, this)).to.not.throw(this.errMessage);

      expect(this.spy.callCount === 3).to.be.true;
    });

  });

  describe('addChildApp', function() {
    beforeEach(function() {
      this.sinon.spy(this.myApp, 'addChildApp');

      this.childApps = {
        cA1: Marionette.Toolkit.App,
        cA2: Marionette.Toolkit.App,
        cA3: Marionette.Toolkit.App
      };

      this.myApp.addChildApps(this.childApps);
    });

    it('should be called three times', function() {
      expect(this.myApp.addChildApp.callCount === 3).to.be.true;
    });
  });

  describe('buildApp', function() {
    describe('when passing an object', function() {

      it('should return and instance of the class', function() {
        var foo = this.myApp.buildApp(Marionette.Toolkit.App);

        expect(foo).to.be.instanceOf(Marionette.Toolkit.App);
      });

    });

    describe('when passing an object to buildApp', function() {

      it('should return an instance of obj.AppClass', function() {
        var bar = { AppClass: Marionette.Toolkit.App };
        var foo = this.myApp.buildApp(bar);

        expect(foo).to.be.instanceOf(bar.AppClass);
      });

    });

  });

  describe('getChildApps', function() {
    before(function() {
      this.childApps = {
        cA1: Marionette.Toolkit.App,
        cA2: Marionette.Toolkit.App,
        cA3: Marionette.Toolkit.App
      };

      this.myApp = new Marionette.Toolkit.App({ childApps: this.childApps });
    });


    it('should return are registered childApps', function() {
      var childAppKeys = _.keys(this.myApp.getChildApps());
      expect(childAppKeys).to.have.length(3);
      expect(childAppKeys).to.eql(_.keys(this.childApps));
    });

  });

  describe('getChildApp', function() {
    beforeEach(function() {
      this.childApps = {
        cA1: Marionette.Toolkit.App,
        cA2: Marionette.Toolkit.App,
        cA3: Marionette.Toolkit.App
      };

      this.myApp = new Marionette.Toolkit.App({ childApps: this.childApps });
    });

    describe('with existing childApp', function() {

      it('should return childApp object', function() {
        var existingChildApp = this.myApp._childApps.cA1;

        expect(this.myApp.getChildApp('cA1')).to.eql(existingChildApp);
      });
    });

    describe('with nonexisting childApp', function() {

      it('should not return a childApp object', function() {
        expect(this.myApp.getChildApp('cA4')).to.not.exist;

        this.myApp.addChildApp('cA4', Marionette.Toolkit.App);

        expect(this.myApp.getChildApp('cA4')).to.exist;
      });

    });

  });

  describe('removeChildApps', function() {
    beforeEach(function() {
      this.childApps = {
        cA1: Marionette.Toolkit.App,
        cA2: Marionette.Toolkit.App,
        cA3: Marionette.Toolkit.App
      };

      this.myApp = new Marionette.Toolkit.App({ childApps: this.childApps });
    });

    it('should remove all childApps', function() {
      expect(this.myApp._childApps).to.not.be.empty;

      this.myApp.removeChildApps();

      expect(this.myApp._childApps).to.be.empty;
    });

  });

  describe('removeChildApp', function() {
    beforeEach(function() {
      this.childApps = {
        cA1: Marionette.Toolkit.App,
        cA2: Marionette.Toolkit.App,
        cA3: Marionette.Toolkit.App
      };

      this.myApp = new Marionette.Toolkit.App({ childApps: this.childApps });

      this.spy = sinon.spy(this.myApp, 'removeChildApps');
    });

    describe('when childApp is not present', function() {

      it('should return undefined', function() {
        expect(this.myApp.removeChildApp('cA4')).to.eql(undefined);
      });

    });

    describe('when childApp is present', function() {

      it('should remove childApp and return it', function() {
        this.myApp.addChildApp('cA4', Marionette.Toolkit.App);

        expect(this.myApp.removeChildApp('cA4')).to.not.eql(undefined);
      });

    });

  });

});
