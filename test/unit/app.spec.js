import $ from 'jquery';
import App from '../../src/app';

describe('App', function() {
  describe('when passing StateModel on Toolkit.App definition', function() {
    before(function() {
      this.MyModel = Backbone.Model.extend({
        foo: 'bar'
      });

      this.myApp = new App({
        StateModel: this.MyModel
      });
    });

    it('should successfully attach StateModel definition', function() {
      expect(this.myApp.StateModel).to.eq(this.MyModel);
    });
  });

  describe('#setRegion', function() {
    beforeEach(function() {
      this.MyApp = App.extend();

      this.sinon.spy(this.MyApp.prototype, 'setRegion');
    });

    describe('when passing a region to App#start', function() {
      beforeEach(function() {
        this.myApp = new this.MyApp({
          region: new Marionette.Region({ el: $('<div>')[0] })
        });
      });

      it('should pass the region to App#setRegion', function() {
        expect(this.myApp.setRegion.called);
      });
    });

    describe('when setting a region', function() {
      beforeEach(function() {
        this.myRegion = new Marionette.Region({ el: $('<div>')[0] });

        const MyApp = this.MyApp.extend({
          onBeforeStart: function() {
            return this.getRegion();
          }
        });

        this.spy = this.sinon.spy(MyApp.prototype, 'onBeforeStart');

        this.myApp = new MyApp();

        this.myApp.setRegion(this.myRegion);
      });

      it('should attach the region to the app', function() {
        expect(this.myApp.getRegion()).to.equal(this.myRegion);
      });

      it('should make the region available during before:start', function() {
        this.myApp.start();
        expect(this.spy.returned(this.myRegion)).to.be.true;
      });
    });
  });
});
