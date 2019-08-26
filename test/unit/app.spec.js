import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import { View, Region } from 'backbone.marionette';
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

  describe('#setRegion', function() {
    beforeEach(function() {
      this.MyApp = App.extend();

      this.sinon.spy(this.MyApp.prototype, 'setRegion');
    });

    describe('when passing a region to App#start', function() {
      beforeEach(function() {
        this.region = new Region({ el: $('<div>')[0] });
        this.myApp = new this.MyApp();

        this.myApp.start({
          region: this.region
        });
      });

      it('should pass the region to App#setRegion', function() {
        expect(this.myApp.setRegion).to.be.calledOnce.and.calledWith(this.region);
      });
    });

    describe('when setting a region', function() {
      beforeEach(function() {
        this.myRegion = new Region({ el: $('<div>')[0] });

        const MyApp = this.MyApp.extend({
          onBeforeStart() {
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
        expect(this.spy).to.have.returned(this.myRegion);
      });

      it('should return the set region', function() {
        const region = new Region({ el: $('<div>')[0] });
        expect(this.myApp.setRegion(region)).to.equal(region);
      });
    });

    describe('when setting a region with a view', function() {
      beforeEach(function() {
        this.myRegion = new Region({ el: $('<div>')[0] });
        this.myRegion.show(new View({ template: false }));

        this.myApp = new this.MyApp();

        this.myApp.setRegion(this.myRegion);
      });

      it('should set the app view to the region view', function() {
        expect(this.myApp.getRegion().currentView).to.equal(this.myApp.getView());
      });
    });
  });

  describe('#getRegion', function() {
    beforeEach(function() {
      this.myRegion = new Region({ el: $('<div>')[0] });

      this.myApp = new App();

      this.myApp.setRegion(this.myRegion);

      this.view = new View({
        template: _.template('<div></div>'),
        regions: { region: 'div' }
      });

      this.myApp.showView(this.view);
    });

    describe('when not passing any arguments', function() {
      it('should get the app\'s region', function() {
        expect(this.myApp.getRegion()).to.equal(this.myRegion);
      });
    });

    describe('when passing a region name', function() {
      it('should get the app view\'s region', function() {
        expect(this.myApp.getRegion('region')).to.equal(this.view.getRegion('region'));
      });
    });
  });

  describe('#setView', function() {
    beforeEach(function() {
      this.MyApp = App.extend();

      this.sinon.spy(this.MyApp.prototype, 'setView');
    });

    describe('when passing a view to App#start', function() {
      beforeEach(function() {
        this.view = new View({ template: _.noop });
        this.myApp = new this.MyApp();

        this.myApp.start({
          view: this.view
        });
      });

      it('should pass the view to App#setView', function() {
        expect(this.myApp.setView).to.be.calledOnce.and.calledWith(this.view);
      });
    });

    describe('when setting a view', function() {
      beforeEach(function() {
        this.myView = new View({ template: _.noop });

        const MyApp = this.MyApp.extend({
          onBeforeStart() {
            return this.getView();
          }
        });

        this.spy = this.sinon.spy(MyApp.prototype, 'onBeforeStart');

        this.myApp = new MyApp();

        this.myApp.setView(this.myView);
      });

      it('should attach the view to the app', function() {
        expect(this.myApp.getView()).to.equal(this.myView);
      });

      it('should make the view available during before:start', function() {
        this.myApp.start();
        expect(this.spy).to.have.returned(this.myView);
      });

      it('should return the set view', function() {
        const view = new View();
        expect(this.myApp.setView(view)).to.equal(view);
      });
    });

    describe('when setting a view during onBeforeStart', function() {
      beforeEach(function() {
        const myView = new View({ template: _.noop });
        const region = new Region({ el: $('<div>')[0] });
        this.viewEventStub = this.sinon.stub();
        const MyApp = this.MyApp.extend({
          onBeforeStart() {
            this.showView(myView);
          },
          viewEvents: {
            'foo': this.viewEventStub
          }
        });

        this.myApp = new MyApp();
        this.myApp.setRegion(region);
      });

      it('should trigger view event set in onBeforeStart', function() {
        this.myApp.start();
        this.myApp.getView().trigger('foo');
        expect(this.viewEventStub).to.have.been.calledOnce;
      })
    });
  });

  describe('#getView', function() {
    beforeEach(function() {
      this.view = new View({ template: _.noop });
      this.setView = new View({ template: _.noop });
      this.region = new Region({ el: $('<div>')[0] });
      this.myApp = new App();

      this.myApp.start({ view: this.setView });
    });

    describe('when there is no app\'s region', function() {
      it('should return the set view', function() {
        expect(this.myApp.getView()).to.equal(this.setView);
      });
    });

    describe('when a view is not shown in the app\'s region', function() {
      it('should return the set view', function() {
        this.myApp.setRegion(this.region);
        expect(this.myApp.getView()).to.equal(this.setView);
      });
    });

    describe('when a view is shown in the app\'s region', function() {
      it('should return the shown view', function() {
        this.myApp.setRegion(this.region);
        this.myApp.showView(this.view);
        expect(this.myApp.getView()).to.equal(this.view);
      });
    });

    describe('when a view is emptied in the app\'s region', function() {
      it('should delete the shown view', function() {
        this.myApp.setRegion(this.region);
        this.myApp.showView(this.view);
        this.myApp.getRegion().empty();
        expect(this.myApp.getView()).to.be.undefined;
      });

      it('should remove any listeners to the view', function() {
        this.sinon.spy(this.myApp, 'stopListening');

        this.myApp.setRegion(this.region);
        this.myApp.showView(this.view);
        this.myApp.stopListening.resetHistory();
        this.myApp.getRegion().empty();
        expect(this.myApp.stopListening).to.have.been.calledWith(this.view);
      });
    });

    describe('when a view is detached from the app\'s region', function() {
      it('should delete the shown view', function() {
        this.myApp.setRegion(this.region);
        this.myApp.showView(this.view);
        this.myApp.getRegion().detachView();
        expect(this.myApp.getView()).to.be.undefined;
      });

      it('should remove any listeners to the view', function() {
        this.sinon.spy(this.myApp, 'stopListening');

        this.myApp.setRegion(this.region);
        this.myApp.showView(this.view);
        this.myApp.stopListening.resetHistory();
        this.myApp.getRegion().detachView();
        expect(this.myApp.stopListening).to.have.been.calledWith(this.view);
      });
    });

    describe('when a view in the app\'s region is destroyed', function() {
      it('should delete the shown view', function() {
        this.myApp.setRegion(this.region);
        this.myApp.showView(this.view);
        this.myApp.getView().destroy();
        expect(this.myApp.getView()).to.be.undefined;
      });

      it('should remove any listeners to the view', function() {
        this.sinon.spy(this.myApp, 'stopListening');

        this.myApp.setRegion(this.region);
        this.myApp.showView(this.view);
        this.myApp.stopListening.resetHistory();
        this.myApp.getView().destroy();
        expect(this.myApp.stopListening).to.have.been.calledWith(this.view);
      });
    });
  });

  describe('#showView', function() {
    beforeEach(function() {
      this.view = new View({ template: _.noop });
      this.setView = new View({ template: _.noop });
      this.region = new Region({ el: $('<div>')[0] });
      this.myApp = new App();

      this.sinon.spy(this.region, 'show');

      this.myApp.start({
        view: this.setView,
        region: this.region
      });
    });

    describe('when no arguments are passed', function() {
      it('should show the set view', function() {
        this.myApp.showView();
        expect(this.region.show).to.be.calledOnce.and.calledWith(this.setView);
      });

      it('should return the shown view', function() {
        expect(this.myApp.showView()).to.equal(this.setView);
      });
    });

    describe('when a view and arguments are passed', function() {
      it('should show the view', function() {
        this.myApp.showView(this.view, 'foo');
        expect(this.region.show).to.be.calledOnce.and.calledWith(this.view, 'foo');
      });

      it('should return the shown view', function() {
        expect(this.myApp.showView(this.view)).to.equal(this.view);
      });
    });
  });

  describe('#showChildView', function() {
    beforeEach(function() {
      const MyApp = App.extend();

      this.sinon.spy(MyApp.prototype, 'showChildView');

      this.myApp = new MyApp({
        region: new Region({ el: $('<div>')[0] })
      });

      const myView = new View({
        regions: {
          someRegion: 'div'
        },
        template: _.template('<div></div>')
      });

      this.sinon.spy(myView, 'showChildView');

      this.myApp.showView(myView);

      this.view = new View({ template: _.noop });

      this.myApp.showChildView('someRegion', this.view, 'foo');
    });

    it('should return the child view', function() {
      expect(this.myApp.showChildView).to.have.returned(this.view);
    });

    it('should call showChildView on the app\'s view', function() {
      expect(this.myApp.getView().showChildView).to.have.been.calledWith('someRegion', this.view, 'foo');
    });
  });

  describe('#getChildView', function() {
    beforeEach(function() {
      const MyApp = App.extend();

      this.sinon.spy(MyApp.prototype, 'getChildView');

      this.myApp = new MyApp({
        region: new Region({ el: $('<div>')[0] })
      });

      const myView = new View({
        regions: {
          someRegion: 'div'
        },
        template: _.template('<div></div>')
      });

      this.sinon.spy(myView, 'getChildView');

      this.myApp.showView(myView);

      this.view = new View({ template: _.noop });

      this.myApp.showChildView('someRegion', this.view);

      this.myApp.getChildView('someRegion');
    });

    it('should return the child view', function() {
      expect(this.myApp.getChildView).to.have.returned(this.view);
    });

    it('should call showChildView on the app\'s view', function() {
      expect(this.myApp.getView().getChildView).to.have.been.calledWith('someRegion');
    });
  });
});
