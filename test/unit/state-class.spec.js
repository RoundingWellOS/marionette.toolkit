import '../../src/marionette.toolkit';

describe('State Class', function() {
  beforeEach(function () {
    this.MyModel = Backbone.Model.extend({
      foo : 'bar'
    });
    this.MyStateClass = Marionette.Toolkit.StateClass.extend({
      StateModel : this.MyModel
    });
  });

  describe('when instantiating a new state object', function () {

   it('should have the default StateModel if none was defined', function () {
     this.myStateClass = new Marionette.Toolkit.StateClass();
     expect(this.myStateClass._stateModel).to.be.an.instanceof(Backbone.Model);
   });

   it('should have the StateModel that was defined', function () {
     this.myStateClass = new this.MyStateClass();
     expect(this.myStateClass._stateModel).to.be.an.instanceof(this.MyModel);
   });

  });

  describe('when setting a state on a state object using setState', function () {

   it('should add the attribute when passed in as simple arguments', function () {
     this.myStateClass = new this.MyStateClass();
     this.myStateClass.setState('test', 'testing');
     expect(this.myStateClass._stateModel.attributes.test).to.equal('testing');
   });

   it('should add the attribute when passed in as an object', function () {
     this.myStateClass = new this.MyStateClass();
     this.myStateClass.setState({
       test: 'testing'
     });
     expect(this.myStateClass._stateModel.attributes.test).to.equal('testing');
   });

  });

  describe('when calling getState with no attribute on a state model', function () {

    it('should return the _stateModel', function () {
      this.myStateClass = new this.MyStateClass();
      expect(this.myStateClass.getState()).to.deep.equal(this.myStateClass._stateModel);
    });

  });

  describe('when calling getState with an attribute on a state model', function () {

    it('should return the state', function () {
      this.myStateClass = new this.MyStateClass();
      this.myStateClass.setState('test', 'testing');
      expect(this.myStateClass.getState('test')).to.equal('testing');
    });

  });

  describe('when destroying a state object', function () {

    it('should be gone', function () {
      this.myStateClass = new this.MyStateClass();
      this.sinon.spy(this.myStateClass, 'stopListening');
      this.myStateClass.destroy();
      expect(this.myStateClass.stopListening).to.have.been.called;
    });

  });

});
