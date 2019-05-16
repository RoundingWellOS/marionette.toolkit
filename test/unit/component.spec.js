import _ from 'underscore';
import Backbone from 'backbone';
import { View, Region } from 'backbone.marionette';
import Component from '../../src/component';

describe('Component', function() {
  beforeEach(function() {
    this.setFixtures('<div id="testRegion"></div>');
    this.el = Backbone.$('#testRegion');
    this.myRegion = new Region({
      el: this.el
    });
  });

  // SHOWING A VIEW
  describe('when showing a component', function() {
    beforeEach(function() {
      this.beforeShowStub = this.sinon.stub();
      this.showStub = this.sinon.stub();
      this.MyViewClass = View.extend({});
      this.MyComponent = Component.extend({
        viewOptions: {
          template: _.template('<div></div>')
        },
        ViewClass: this.MyViewClass
      });
      this.myComponent = new this.MyComponent();
      this.myComponent.on('before:show', this.beforeShowStub, function() {});
      this.myComponent.on('show', this.showStub, function() {});
    });

    describe('in a specified region "showIn()"', function() {
      it('should show the component', function() {
        this.myComponent.showIn(this.myRegion);
        expect(this.myComponent.getRegion().currentView).to.not.be.null;
      });

      it('should fire the before:show methods', function() {
        this.myComponent.showIn(this.myRegion);
        expect(this.beforeShowStub).to.have.been.calledOnce;
      });

      it('should fire the show methods', function() {
        this.myComponent.showIn(this.myRegion);
        expect(this.showStub).to.have.been.calledOnce;
      });

      it('should throw a "no defined region" error when no region is defined', function() {
        expect(_.bind(function() {
          this.myComponent.showIn();
        }, this)).to.throw('Component has no defined region.');
      });
    });

    describe('in a region on the component definition "show()"', function() {
      it('should show the component', function() {
        this.ShowComponent = this.MyComponent.extend({
          region: this.myRegion
        });
        this.showComponent = new this.ShowComponent();
        this.showComponent.show({
          className: 'my-component-class'
        });
        expect(this.showComponent.getRegion().currentView).to.not.be.null;
      });
    });
  });

  // RETRIVING A COMPONENT'S region
  describe('when retriving a component\'s region', function() {
    beforeEach(function() {
      this.renderStub = this.sinon.stub();
      this.MyViewClass = View;
      this.MyComponent = Component.extend({
        region: this.myRegion,
        ViewClass: this.MyViewClass,
        viewOptions: {
          template: _.template('<div></div>')
        }
      });
      this.myComponent = new this.MyComponent();
    });

    it('should return component region', function() {
      expect(this.myComponent.getRegion()).to.deep.eq(this.myRegion);
    });
  });

  describe('when emptying a component\'s region', function() {
    beforeEach(function() {
      this.MyComponent = Component.extend({
        region: this.myRegion
      });
      this.myComponent = new this.MyComponent();

      this.myComponent.show({ template: false });
    });

    it('should not destroy with component#empty', function() {
      this.myComponent.empty();
      expect(this.myComponent.isDestroyed()).to.be.false;
    });

    it('should destroy with region#empty', function() {
      this.myRegion.empty();
      expect(this.myComponent.isDestroyed()).to.be.true;
    });

    it('should throw a "no defined region" error when no region is defined', function() {
      expect(_.bind(function() {
        this.myComponent._region = null;
        this.myComponent.empty()
      }, this)).to.throw('Component has no defined region.');
    });
  });

  // SETTING ViewClass
  describe('when defining ViewClass as a function that returns a view class', function() {
    beforeEach(function() {
      this.MyComponent = Component.extend({
        region: this.myRegion,
        ViewClass(options) {
          if (options.foo) {
            return View.extend({
              customViewOption: 'bar',
              template: _.template('<div></div>')
            });
          }
          return View;
        }
      });
      this.myComponent = new this.MyComponent();

      this.myComponent.show({ foo: true });
    });

    it('should use the correct view class for passed options', function() {
      expect(this.myComponent.getView().getOption('customViewOption')).to.equal('bar');
    });
  });

  describe('when defining ViewClass as neither a function or a class', function() {
    beforeEach(function() {
      this.MyComponent = Component.extend({
        region: this.myRegion,
        ViewClass: 'Invalid View'
      });
      this.myComponent = new this.MyComponent();
    });

    it('should throw an error saying the ViewClass is invalid', function() {
      expect(_.bind(this.myComponent.show, this.myComponent)).to.throw('"ViewClass" must be a view class or a function that returns a view class');
    });
  });

  // INSTANTIATING A COMPONENT WITH OPTIONS
  describe('when instantiating a component', function() {
    it('should delegate state events', function() {
      this.MyComponent = Component.extend();
      this.sinon.spy(this.MyComponent.prototype, 'delegateStateEvents');
      this.myComponent = new this.MyComponent();

      expect(this.myComponent.delegateStateEvents).to.be.calledOnce;
    });

    describe('with state options', function() {
      it('should initialize stateModel with passed in state', function() {
        this.MyComponent = Component.extend();

        this.myComponent = new this.MyComponent({
          state: {
            foo: 'bar'
          }
        });

        expect(this.myComponent.getState('foo')).to.equal('bar');
      });
    });

    describe('with defined viewOptions', function() {
      beforeEach(function() {
        this.MyView = View.extend({
          initialize(options) {
            this.test = options.foo;
          }
        });
      });

      describe('on the instance', function() {
        it('should set the option on the view', function() {
          this.MyComponent = Component.extend({
            ViewClass: this.MyView,
            region: this.myRegion,
            viewOptions: {
              foo: 'bar1',
              template: false
            }
          });
          this.myComponent = new this.MyComponent();
          this.myComponent.show();
          expect(this.myComponent.getView().test).to.equal('bar1');
        });
      });

      describe('as specified as a function', function() {
        it('should set the option on the view', function() {
          this.MyComponent = Component.extend({
            ViewClass: this.MyView,
            region: this.myRegion,
            viewOptions: {
              foo: 'bar2',
              template: false
            }
          });
          this.myComponent = new this.MyComponent();
          this.myComponent.show();
          expect(this.myComponent.getView().test).to.equal('bar2');
        });
      });
    });

    describe('with defined regionOptions', function() {
      beforeEach(function() {
        const TestRegion = Region.extend({
          onShow: this.sinon.stub()
        });
        this.myTestRegion = new TestRegion({
          el: this.el
        });
      });

      describe('on the instance', function() {
        it('should pass the options to the region#show', function() {
          this.MyComponent = Component.extend({
            region: this.myTestRegion,
            regionOptions: {
              foo: 'bar1'
            },
            viewOptions: {
              template: false
            }
          });
          this.myComponent = new this.MyComponent();
          this.myComponent.show();
          expect(this.myTestRegion.onShow)
            .to.be.calledWith(this.myTestRegion, this.myComponent.getView(), this.myComponent.regionOptions);
        });
      });

      describe('as specified as a function', function() {
        it('should pass the options to the region#show', function() {
          this.MyComponent = Component.extend({
            region: this.myTestRegion,
            _regionOptions: {
              foo: 'bar2'
            },
            regionOptions() {
              return this._regionOptions;
            },
            viewOptions: {
              template: false
            }
          });
          this.myComponent = new this.MyComponent();
          this.myComponent.show();
          expect(this.myTestRegion.onShow)
            .to.be.calledWith(this.myTestRegion, this.myComponent.getView(), this.myComponent._regionOptions);
        });
      });
    });
  });

  // DESTROYING COMPONENTS
  describe('when destroying a component', function() {
    describe('with a defined region', function() {
      it('should be destroyed and region emptied', function() {
        this.MyComponent = Component.extend({
          region: this.myRegion
        });
        this.myComponent = new this.MyComponent();
        this.myComponent.destroy();
      });
    });

    describe('with a destroyed component', function() {
      it('should return the component', function() {
        this.MyComponent = Component.extend({
          region: this.myRegion
        });
        this.myComponent = new this.MyComponent();
        this.myComponent.destroy();
        expect(this.myComponent.destroy()).to.equal(this.myComponent);
      });
    });

    describe('without a defined region', function() {
      it('should be destroyed', function() {
        this.myComponent = new Component();
        this.myComponent.destroy();
      });
    });

    describe('by showing a new view in the region', function() {
      beforeEach(function() {
        this.destroyEvent = this.sinon.stub();
        this.MyComponent = Component.extend({
          viewOptions: {
            template: false
          }
        });
        this.myComponent = new this.MyComponent();
        this.myComponent.on('destroy', this.destroyEvent);
        this.myComponent.showIn(this.myRegion);
      });

      it('should trigger a destroy event on the component', function() {
        this.myRegion.show(new View({
          template: false
        }));
        expect(this.destroyEvent).to.have.been.calledOnce;
      });

      it('should not trigger a destroy event on rendering a view after show', function() {
        this.myComponent.show();
        expect(this.destroyEvent).to.have.not.been.called;
      });
    });
  });

  describe('setting a region on a component class', function() {
    it('should instantiate a component with that region', function() {
      this.MyComponent = Component.extend({});
      this.MyComponent.setRegion(this.myRegion);
      this.myComponent = new this.MyComponent();
      expect(this.myComponent.getRegion()).to.equal(this.myRegion);
    });
  });
});
