describe('App Manager', function() {
  beforeEach(function() {
    this.MyApp = Marionette.Toolkit.App.extend({
      fooOption: 'bar'
    });

    this.myApp = new this.MyApp();

    this.childApps = {
      cA1: Marionette.Toolkit.App,
      cA2: Marionette.Toolkit.App,
      cA3: Marionette.Toolkit.App
    };
  });

  describe('when instantiating', function() {
    describe('without declared child apps', function() {
      describe('childApps object', function() {
        it('should not be created', function() {
          expect(this.myApp.childApps).to.be.undefined;
        });
      });

      describe('_childApps object', function() {
        it('should be created but empty', function() {
          expect(this.myApp.childApps).to.not.be.null;
          expect(_.keys(this.myApp._childApps)).to.have.length(0);
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
          const errMessage = 'App build failed.  Incorrect configuration.';

          // Bind function because `this` needs to be the other describe block
          expect(_.bind(this.myApp.addChildApp, this.myApp)).to.throw(errMessage);
        });
      });
    });

    describe('with declared child apps', function() {
      describe('constructor', function() {
        beforeEach(function() {
          const childApps = {
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
          const childApps = {
            cA1: Marionette.Toolkit.App,
            cA2: Marionette.Toolkit.App,
            cA3: Marionette.Toolkit.App
          };
          this.sinon.spy(this.myApp, '_initChildApps');
          this.myApp = new Marionette.Toolkit.App({ childApps: childApps });

          expect(this.myApp._initChildApps.called);
          expect(_.keys(this.myApp._childApps)).to.have.length(3);
        });

        describe('when passing childApps as a function', function() {
          beforeEach(function() {
            const childApps = function() {
              return {
                cA1: Marionette.Toolkit.App,
                cA2: Marionette.Toolkit.App
              };
            };

            this.MyApp2 = Marionette.Toolkit.App.extend({
              childApps: childApps
            });
          });

          it('should use the results of the childApps function', function() {
            this.myApp = new this.MyApp2();

            expect(_.keys(this.myApp._childApps)).to.have.length(2);
          });

          it('should pass options to childApps', function() {
            const opts = { fooOption: 'bar' };

            this.sinon.stub(this.MyApp2.prototype, 'childApps');
            this.myApp = new this.MyApp2(opts);

            expect(this.MyApp2.prototype.childApps)
              .to.have.been.calledOnce
              .and.calledWith(opts);
          });
        });
      });
    });
  });

  describe('when adding a child app', function() {
    describe('using addChildApp with an object literal', function() {
      beforeEach(function() {
        this.myApp.addChildApp('newChildApp', {
          AppClass: this.MyApp,
          bazOption: true
        });
      });

      it('should contain the options from the initial MyApp definition', function() {
        expect(this.myApp.getOption('fooOption')).to.equal('bar');
      });

      it('should contain the options on the added childApp', function() {
        expect(this.myApp.getChildApp('newChildApp').getOption('bazOption')).to.equal(true);
      });
    });

    describe('using addChildApps', function() {
      beforeEach(function() {
        this.sinon.spy(this.myApp, 'addChildApps');
        this.myApp.addChildApps(this.childApps);
      });

      it('should be called', function() {
        expect(this.myApp.addChildApps.called).to.be.true;
      });

      it('should have arguments', function() {
        expect(this.myApp.addChildApps.calledWith(this.childApps)).to.be.true;
      });
    });
  });

  describe('_ensureAppIsUnique', function() {
    beforeEach(function() {
      this.thirdChildAppName = 'cA3';
      this.fourthChildAppName = 'cA4';
      this.errMessage = 'A child App with name "cA3" has already been added.';
      this.myApp = new Marionette.Toolkit.App();
      this.myApp.addChildApps(this.childApps);
    });

    it('should throw error if a duplicate child exists', function() {
      expect(_.bind(function() {
        this.myApp._ensureAppIsUnique(this.thirdChildAppName);
      }, this)).to.throw(this.errMessage);
    });

    it('should not throw an error if new child app is not a duplicate', function() {
      expect(_.bind(function() {
        this.myApp._ensureAppIsUnique(this.fourthChildAppName);
      }, this)).to.not.throw(Error);
    });
  });

  describe('addChildApp', function() {
    beforeEach(function() {
      this.sinon.spy(this.myApp, 'addChildApp');

      this.myApp.addChildApps(this.childApps);
    });

    it('should be called three times', function() {
      expect(this.myApp.addChildApp.callCount === 3).to.be.true;
    });

    it('should assign the childApp name to the passed in appName', function() {
      expect(this.myApp.addChildApp('cA4', Marionette.Toolkit.App)).to.have.property('_name', 'cA4');
    });
  });

  describe('getName', function() {
    beforeEach(function() {
      this.sinon.spy(this.myApp, 'addChildApp');

      this.myApp.addChildApps(this.childApps);
    });

    it('should return the name of the childApp', function() {
      expect(this.myApp.getChildApp('cA1').getName()).to.equal('cA1');
    });

    it('should return undefined for an app that is not a child app', function() {
      expect(this.myApp.getName()).to.be.undefined;
    });

    it('should return undefined if a childApp has been removed from parent', function() {
      const childApp = this.myApp.getChildApp('cA3');
      this.myApp.removeChildApp('cA3');

      expect(childApp.getName()).to.be.undefined;
    });
  });

  describe('buildApp', function() {
    describe('when passing an object', function() {
      it('should return and instance of the class', function() {
        const foo = this.myApp.buildApp(Marionette.Toolkit.App);

        expect(foo).to.be.instanceOf(Marionette.Toolkit.App);
      });
    });
  });

  describe('getChildApps', function() {
    before(function() {
      this.myApp = new Marionette.Toolkit.App({ childApps: this.childApps });
    });

    it('should return are registered childApps', function() {
      const childAppKeys = _.keys(this.myApp.getChildApps());
      expect(childAppKeys).to.have.length(3);
      expect(childAppKeys).to.eql(_.keys(this.childApps));
    });
  });

  describe('getChildApp', function() {
    beforeEach(function() {
      this.myApp = new Marionette.Toolkit.App({ childApps: this.childApps });
    });

    describe('with existing childApp', function() {
      it('should return childApp object', function() {
        const existingChildApp = this.myApp._childApps.cA1;

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
