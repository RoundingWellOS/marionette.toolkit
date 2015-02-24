import '../../src/marionette.toolkit';

describe('App Manager', function() {

  describe('when instantiating', function() {
    beforeEach(function() {
      this.myApp = new Marionette.Toolkit.App();
    });

    it('should be an instanceOf Marionette.Toolkit.App', function() {
      expect(this.myApp).to.be.an.instanceOf(Marionette.Toolkit.App);
    });

    describe('without declared child apps', function() {

      describe('_childApps object', function() {

        it('should be empty', function() {
          expect(Object.keys(this.myApp._childApps)).to.have.length(0);
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

      describe('childApps object', function() {
        before(function() {
          this.childApps = {
            cA1: Marionette.Toolkit.App,
            cA2: Marionette.Toolkit.App
          };

          this.myApp = new Marionette.Toolkit.App({ childApps: this.childApps });
        });

        it('should have two childApps', function() {
          expect(this.myApp.childApps).to.not.be.undefined;
          expect(Object.keys(this.myApp.childApps)).to.have.length(2);
        });

      });

      describe('buildApp', function() {
        describe('when passing a class', function() {

          it('should return and instance of the class', function() {
            var foo = this.myApp.buildApp(Marionette.Toolkit.App);

            expect(foo).to.be.instanceOf(Marionette.Toolkit.App);
          });

        });

        describe('when passing an object', function() {

          it('should return an instance of obj.AppClass', function() {
            var bar = { AppClass: Marionette.Toolkit.App };
            var foo = this.myApp.buildApp(bar);

            expect(foo).to.be.instanceOf(bar.AppClass);
          });

        });

      });

    });


      // describe('when passing one childApp to addChildApps', function() {
      //   before(function() {
      //     this.childApps = {
      //       cA1: Marionette.Toolkit.App
      //     };
      //
      //     this.myApp = new Marionette.Toolkit.App({ childApps: this.childApps });
      //   });
      //
      //   it('should have one child in _childApps object', function() {
      //     expect(this.myApp._childApps)
      //   });
      //
      // });

  });

});
