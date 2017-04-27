describe('Marionette.Toolkit.Component', function() {
  beforeEach(function() {
    this.setFixtures('<div id="testRegion"></div>');
    this.el = Backbone.$('#testRegion');
    this.myRegion = new Backbone.Marionette.Region({
      el: this.el
    });
  });

  // SHOWING A VIEW
  describe('when showing a component', function() {
    beforeEach(function() {
      this.beforeShowStub = this.sinon.stub();
      this.showStub = this.sinon.stub();
      this.MyViewClass = Marionette.View.extend({});
      this.MyComponent = Marionette.Toolkit.Component.extend({
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
        expect(this.myComponent._isShown).to.equal(true);
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

      it('should throw a "already been shown" error if component has been shown', function() {
        this.myComponent.showIn(this.myRegion);
        expect(_.bind(function() {
          this.myComponent.showIn(this.myRegion);
        }, this)).to.throw('Component has already been shown in a region.');
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
        expect(this.showComponent._isShown).to.equal(true);
      });
    });
  });

  // RETRIVING A COMPONENT'S region
  describe('when retriving a component\'s region', function() {
    beforeEach(function() {
      this.renderStub = this.sinon.stub();
      this.MyViewClass = Marionette.View;
      this.MyComponent = Marionette.Toolkit.Component.extend({
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

  // RENDERING A VIEW WITH renderView()
  describe('when rendering a view', function() {
    beforeEach(function() {
      this.beforeRenderStub = this.sinon.stub();
      this.renderStub = this.sinon.stub();
      this.MyViewClass = Marionette.View;
      this.MyComponent = Marionette.Toolkit.Component.extend({
        region: this.myRegion,
        ViewClass: this.MyViewClass,
        viewOptions: {
          template: _.template('<div></div>')
        }
      });
      this.myComponent = new this.MyComponent();
      this.myComponent.on('before:render:view', this.beforeRenderStub, function() {});
      this.myComponent.on('render:view', this.renderStub, function() {});
    });

    it('should fire the before:render:view methods', function() {
      this.myComponent.renderView({
        className: 'other-component-class'
      });
      expect(this.beforeRenderStub).to.have.been.calledOnce;
    });

    it('should fire the render:view methods', function() {
      this.myComponent.renderView({
        className: 'other-component-class'
      });
      expect(this.renderStub).to.have.been.calledOnce;
    });

    describe('and checking the currentView', function() {
      it('should have the correct className on currentView', function() {
        this.myComponent.renderView({
          className: 'my-component-class'
        });
        expect(this.myComponent.currentView.className).to.equal('my-component-class');
      });
    });

    describe('with a defined ViewClass', function() {
      it('should return the correct ViewClass', function() {
        this.myComponent.renderView();
        const test = this.myComponent.currentView;
        expect(test).to.be.instanceof(this.MyViewClass);
      });
    });

    // The test for mixinOptions()
    describe('with additional options passed in', function() {
      it('should put the options on currentView', function() {
        this.myComponent.renderView({
          foo: 'bar'
        });
        expect(this.myComponent.currentView.options.foo).to.equal('bar');
      });
    });
  });

  // SETTING ViewClass
  describe('when defining ViewClass as a function that returns a view class', function() {
    beforeEach(function() {
      this.MyComponent = Marionette.Toolkit.Component.extend({
        region: this.myRegion,
        ViewClass: function(options) {
          if(options.foo) {
            return Marionette.View.extend({
              customViewOption: 'bar',
              template: _.template('<div></div>')
            });
          }
          return Marionette.View;
        }
      });
      this.myComponent = new this.MyComponent();

      this.myComponent.show({ foo: true });
    });

    it('should use the correct view class for passed options', function() {
      expect(this.myComponent.currentView.getOption('customViewOption')).to.equal('bar');
    });
  });

  describe('when defining ViewClass as neither a function or a class', function() {
    beforeEach(function() {
      this.MyComponent = Marionette.Toolkit.Component.extend({
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
      this.MyComponent = Marionette.Toolkit.Component.extend();
      this.sinon.spy(this.MyComponent.prototype, 'delegateStateEvents');
      this.myComponent = new this.MyComponent();

      expect(this.myComponent.delegateStateEvents).to.be.calledOnce;
    });

    describe('with state options', function() {
      it('should initialize stateModel with passed in state', function() {
        this.MyComponent = Marionette.Toolkit.Component.extend();

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
        this.MyView = Marionette.View.extend({
          initialize: function(options) {
            this.test = options.foo;
          }
        });
      });

      describe('on the view instance', function() {
        it('should do what...', function() {
          this.MyComponent = Marionette.Toolkit.Component.extend({
            ViewClass: this.MyView,
            region: this.myRegion,
            viewOptions: {
              foo: 'bar1',
              template: false
            }
          });
          this.myComponent = new this.MyComponent();
          this.myComponent.renderView();
          expect(this.myComponent.currentView.test).to.equal('bar1');
        });
      });

      describe('as specified as a function', function() {
        it('should do what...', function() {
          this.MyComponent = Marionette.Toolkit.Component.extend({
            ViewClass: this.MyView,
            region: this.myRegion,
            viewOptions: {
              foo: 'bar2',
              template: false
            }
          });
          this.myComponent = new this.MyComponent();
          this.myComponent.renderView();
          expect(this.myComponent.currentView.test).to.equal('bar2');
        });
      });
    });
  });

  // DESTROYING COMPONENTS
  describe('when destroying a component', function() {
    describe('with a defined region', function() {
      it('should be destroyed and region emptied', function() {
        this.MyComponent = Marionette.Toolkit.Component.extend({
          region: this.myRegion
        });
        this.myComponent = new this.MyComponent();
        this.myComponent.destroy();
      });
    });

    describe('without a defined region', function() {
      it('should be destroyed', function() {
        this.myComponent = new Marionette.Toolkit.Component();
        this.myComponent.destroy();
      });
    });

    describe('by showing a new view in the region', function() {
      beforeEach(function() {
        this.destroyEvent = this.sinon.stub();
        this.MyComponent = Marionette.Toolkit.Component.extend({
          viewOptions: {
            template: false
          }
        });
        this.myComponent = new this.MyComponent();
        this.myComponent.on('destroy', this.destroyEvent);
        this.myComponent.showIn(this.myRegion);
      });

      it('should trigger a destroy event on the component', function() {
        this.myRegion.show(new Marionette.View({
          template: false
        }));
        expect(this.destroyEvent).to.have.been.calledOnce;
      });

      it('should not trigger a destroy event on rendering a view after show', function() {
        this.myComponent.renderView();
        expect(this.destroyEvent).to.have.not.been.called;
      });
    });
  });
});
