import _ from 'underscore';
import Backbone from 'backbone';
import { Region, View } from 'backbone.marionette';
import App from '../../../src/app';
import Component from '../../../src/component';

describe('ViewEventsMixin', function() {
  const mergeOptions = {
    viewEventPrefix: 'child',
    viewEvents: {},
    viewTriggers: {}
  };

  let myRegion;

  beforeEach(function() {
    this.setFixtures('<div id="testRegion"></div>');
    myRegion = new Region({
      el: Backbone.$('#testRegion')
    });
  });

  describe('when starting an app', function() {
    let myApp;

    beforeEach(function() {
      const MyApp = App.extend();
      this.sinon.spy(MyApp.prototype, '_buildEventProxies');
      myApp = new MyApp(mergeOptions);
      myApp.start();
    });

    _.each(mergeOptions, function(value, key) {
      it(`should merge ViewEventsMixin option ${ key }`, function() {
        expect(myApp[key]).to.equal(value);
      });
    });

    it('should build event proxies', function() {
      expect(myApp._buildEventProxies).to.have.been.calledOnce;
    });
  });

  describe('when initializing a component', function() {
    let myComponent;

    beforeEach(function() {
      const MyComponent = Component.extend();
      this.sinon.spy(MyComponent.prototype, '_buildEventProxies');
      myComponent = new MyComponent(mergeOptions);
    });

    _.each(mergeOptions, function(value, key) {
      it(`should merge ViewEventsMixin option ${ key }`, function() {
        expect(myComponent[key]).to.equal(value);
      });
    });

    it('should build event proxies', function() {
      expect(myComponent._buildEventProxies).to.have.been.calledOnce;
    });
  });

  describe('when a view is set to an app', function() {
    it('should proxy view events', function() {
      const myApp = new App();
      this.sinon.spy(myApp, '_proxyViewEvents');

      const myView = new View();
      myApp.setView(myView);

      myApp.start();

      expect(myApp._proxyViewEvents)
        .to.have.been.calledOnce.and.calledWith(myView);
    });
  });

  describe('when a view is rendered on a component', function() {
    it('should proxy view events', function() {
      const myComponent = new Component({
        viewOptions: {
          template: _.template('foo')
        }
      });
      this.sinon.spy(myComponent, '_proxyViewEvents');

      myComponent.showIn(myRegion);


      expect(myComponent._proxyViewEvents)
        .to.have.been.calledOnce.and.calledWith(myComponent.getView());
    });
  });

  describe('viewEventPrefix', function() {
    describe('when viewEventPrefix is left false', function() {
      it('should not trigger the action', function() {
        const handlerStub = this.sinon.stub();

        const MyComponent = Component.extend({
          viewOptions: {
            template: _.noop
          }
        });
        const myComponent = new MyComponent();

        myComponent.showIn(myRegion);
        myComponent.on('some:prefix:render', handlerStub);
        myComponent.getView().render();

        expect(handlerStub).to.not.have.been.called;
      });
    });

    describe('when defining a viewEventPrefix', function() {
      it('should trigger the correct action as defined', function() {
        const handlerStub = this.sinon.stub();

        const MyComponent = Component.extend({
          viewEventPrefix: 'some:prefix',
          viewOptions: {
            template: _.noop
          }
        });
        const myComponent = new MyComponent();

        myComponent.showIn(myRegion);
        myComponent.on('some:prefix:render', handlerStub);
        myComponent.getView().render();

        expect(handlerStub).to.have.been.calledOnce;
      });
    });
  });

  describe('viewEvents', function() {
    let fooStub;
    let barStub;
    let myView;

    beforeEach(function() {
      fooStub = this.sinon.stub();
      barStub = this.sinon.stub();

      const MyApp = App.extend({
        viewEvents: {
          'foo': fooStub,
          'bar': 'onBarStub'
        },
        onBarStub: barStub
      });

      const myApp = new MyApp();
      myView = new View();

      myApp.setView(myView);

      myApp.start();
    });

    it('should trigger view events to a function handle', function() {
      const args = {};
      myView.trigger('foo', args);
      expect(fooStub).to.have.been.calledOnce.and.calledWith(args);
    });

    it('should trigger view events to a named handle', function() {
      const args = {};
      myView.trigger('bar', args);
      expect(barStub).to.have.been.calledOnce.and.calledWith(args);
    });
  });

  describe('viewTriggers', function() {
    let fooStub;
    let myView;

    beforeEach(function() {
      fooStub = this.sinon.stub();

      const MyApp = App.extend({
        viewTriggers: {
          'foo': 'foo'
        }
      });

      const myApp = new MyApp();

      myApp.on('foo', fooStub);

      myView = new View();

      myApp.setView(myView);

      myApp.start();
    });

    it('should trigger view events to a event on the app', function() {
      const args = {};
      myView.trigger('foo', args);
      expect(fooStub).to.have.been.calledOnce.and.calledWith(args);
    });
  });
});
