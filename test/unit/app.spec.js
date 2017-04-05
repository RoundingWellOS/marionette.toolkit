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

  describe('when passing stateEvents on Toolkit.App definition', function() {
    before(function() {
      this.onChangeStub = this.sinon.stub();

      this.myApp = new App({
        stateEvents: {
          'change': this.onChangeStub
        }
      });

      this.myApp.start();
    });

    it('should successfully user stateEvents', function() {
      this.myApp.setState('foo', 'bar');
      expect(this.onChangeStub).to.have.been.calledOnce;
    });
  });

  describe('when restarting the app', function() {
    before(function() {
      this.myApp = new App({
        state: {
          'foo': 'bar'
        }
      });

      this.myApp.start();

      this.myApp.setState('foo', 'baz');

      this.myApp.restart();
    });

    it('should maintain the previous app\'s state', function() {
      expect(this.myApp.getState('foo')).to.equal('baz');
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

  describe('#showChildView', function() {
    beforeEach(function() {
      const MyApp = App.extend();

      this.sinon.spy(MyApp.prototype, 'showChildView');

      this.myApp = new MyApp({
        region: new Marionette.Region({ el: $('<div>')[0] })
      });
    });

    describe('when the app region has a view', function() {
      beforeEach(function() {
        const myView = new Marionette.View({
          regions: {
            someRegion: 'div'
          },
          template: _.template('<div></div>')
        });

        this.sinon.spy(myView, 'showChildView');

        this.myApp.showView(myView);

        this.view = new Marionette.View({ template: false });

        this.myApp.showChildView('someRegion', this.view, 'foo');
      });

      it('should return the child view', function() {
        expect(this.myApp.showChildView.returned(this.view)).to.be.true;
      });

      it('should call showChildView on the app\'s view', function() {
        expect(this.myApp.getView().showChildView).to.have.been.calledWith('someRegion', this.view, 'foo');
      });
    });

    describe('when the app region does not have a view', function() {
      it('should return false', function() {
        this.myApp.showChildView('someRegion', new Marionette.View());
        expect(this.myApp.showChildView.returned(false)).to.be.true;
      });
    });
  });

  describe('#getChildView', function() {
    beforeEach(function() {
      const MyApp = App.extend();

      this.sinon.spy(MyApp.prototype, 'getChildView');

      this.myApp = new MyApp({
        region: new Marionette.Region({ el: $('<div>')[0] })
      });
    });


    describe('when the app region has a view', function() {
      beforeEach(function() {
        const myView = new Marionette.View({
          regions: {
            someRegion: 'div'
          },
          template: _.template('<div></div>')
        });

        this.sinon.spy(myView, 'getChildView');

        this.myApp.showView(myView);

        this.view = new Marionette.View({ template: false });

        this.myApp.showChildView('someRegion', this.view);

        this.myApp.getChildView('someRegion');
      });

      it('should return the child view', function() {
        expect(this.myApp.getChildView.returned(this.view)).to.be.true;
      });

      it('should call showChildView on the app\'s view', function() {
        expect(this.myApp.getView().getChildView).to.have.been.calledWith('someRegion');
      });
    });

    describe('when the app region does not have a view', function() {
      it('should return false', function() {
        this.myApp.getChildView('someRegion');
        expect(this.myApp.getChildView.returned(false)).to.be.true;
      });
    });
  });
});
