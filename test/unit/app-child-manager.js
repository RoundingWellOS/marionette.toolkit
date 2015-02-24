import '../../src/marionette.toolkit';

describe('App Manager', function() {
  describe('when passing a class to buildApp', function() {
    beforeEach(function() {
      this.myApp = new Marionette.Toolkit.App();
    });

    it('should return and instance of the clas', function() {
      var foo = this.myApp.buildApp(Marionette.Toolkit.App);

      expect(foo).to.be.instanceOf(Marionette.Toolkit.App);
    });

    describe('when passing an object to buildApp', function() {
      it('should return an instance of obj.AppClass', function() {
        var bar = { AppClass: Marionette.Toolkit.App };
        var foo = this.myApp.buildApp(bar);

        expect(foo).to.be.instanceOf(bar.AppClass);
      });
    });

  });

});
