import Marionette from 'backbone.marionette';

describe('StateMixin', function() {
  beforeEach(function() {
    this.MyModel = Backbone.Model.extend({
      foo: 'bar'
    });

    this.StateClass = Marionette.Object.extend();

    _.extend(this.StateClass.prototype, Marionette.Toolkit.StateMixin);

    this.MyStateClass = this.StateClass.extend({
      initialize(options) {
        this.initState(options);
      },
      stateEvents: {
        'change': 'stateChanged'
      },
      StateModel: this.MyModel,
      stateChanged: function() {}
    });

    this.myStateClass = new this.MyStateClass({
      state: {
        fooState: 'fooDefault'
      }
    });
  });

  describe('when instantiating a new state object', function() {
    it('should contain the defined state', function() {
      expect(this.myStateClass.getState('fooState')).to.equal('fooDefault');
    });

    it('should have the default StateModel if none was defined', function() {
      expect(this.myStateClass._stateModel).to.be.an.instanceof(Backbone.Model);
    });

    it('should have the StateModel that was defined', function() {
      expect(this.myStateClass._stateModel).to.be.an.instanceof(this.MyModel);
    });
  });

  describe('when setting a state on a state object using setState', function() {
    it('should add the attribute when passed in as simple arguments', function() {
      this.myStateClass.setState('test', 'testing');
      expect(this.myStateClass._stateModel.attributes.test).to.equal('testing');
    });

    it('should add the attribute when passed in as an object', function() {
      this.myStateClass.setState({
        test: 'testing'
      });
      expect(this.myStateClass._stateModel.attributes.test).to.equal('testing');
    });
  });

  // SETTING StateModel
  describe('when defining StateModel as a function that returns a model class', function() {
    beforeEach(function() {
      this.StateClass = Marionette.Object.extend();
      _.extend(this.StateClass.prototype, Marionette.Toolkit.StateMixin);

      this.MyStateClass = this.StateClass.extend({
        initialize(options) {
          this.initState(options);
        },
        StateModel: function(options) {
          if(options.foo) {
            return Backbone.Model.extend({
              customAttr: 'bar'
            });
          }
          return Backbone.Model;
        }
      });

      this.myStateClass = new this.MyStateClass({ foo: true });
    });

    it('should use the correct model class for the passed options', function() {
      expect(this.myStateClass.getState().customAttr).to.equal('bar');
    });
  });

  describe('when defining StateModel as neither a function or a class', function() {
    beforeEach(function() {
      this.StateClass = Marionette.Object.extend();
      _.extend(this.StateClass.prototype, Marionette.Toolkit.StateMixin);

      this.MyStateClass = this.StateClass.extend({
        initialize(options) {
          this.initState(options);
        },
        StateModel: 'Invalid Class'
      });
    });

    it('should throw an error saying the StateModel is invalid', function() {
      expect(_.bind(function() {
        this.myStateClass = new this.MyStateClass();
      }, this)).to.throw('"StateModel" must be a model class or a function that returns a model class');
    });
  });

  describe('when triggering a stateEvent', function() {
    it('should call the correct stateEvent', function() {
      this.eventsStub = this.sinon.stub();
      this.myStateClass._stateModel.on('change', this.eventsStub);
      this.myStateClass.setState('foo', 'testing');
      expect(this.eventsStub).to.have.been.calledOnce;
    });
  });

  describe('when calling getState with no attribute on a state model', function() {
    it('should return the _stateModel', function() {
      expect(this.myStateClass.getState()).to.deep.equal(this.myStateClass._stateModel);
    });
  });

  describe('when calling getState with an attribute on a state model', function() {
    it('should return the state', function() {
      this.myStateClass.setState('test', 'testing');
      expect(this.myStateClass.getState('test')).to.equal('testing');
    });
  });

  describe('when destroying a state object', function() {
    it('should be gone', function() {
      this.sinon.spy(this.myStateClass._stateModel, 'stopListening');
      this.myStateClass.destroy();
      expect(this.myStateClass._stateModel.stopListening).to.have.been.calledOnce;
    });
  });

  describe('when calling initState after initialization', function() {
    it('should create a new _stateModel', function() {
      const orgStateCID = this.myStateClass._stateModel.cid;

      this.myStateClass.initState();

      const newStateCID = this.myStateClass._stateModel.cid;

      expect(newStateCID).to.not.equal(orgStateCID);
    });

    it('should remove listeners from previous _stateModel', function() {
      const orgStateModel = this.myStateClass._stateModel;

      this.sinon.spy(this.myStateClass._stateModel, 'stopListening');
      this.sinon.spy(this.myStateClass, 'unbindEntityEvents');
      this.sinon.spy(this.myStateClass, 'off');

      this.myStateClass.initState();

      expect(orgStateModel.stopListening).to.have.been.calledOnce;
      expect(this.myStateClass.unbindEntityEvents).to.have.been.calledOnce;
      expect(this.myStateClass.off).to.have.been.calledWith('destroy', this.myStateClass._destroyState);
    });
  });
});
