describe('Marionette.Toolkit.noConflict()', function() {
  describe('when calling noConflict', function() {
    it('should make Marionette.Toolkit return undefined', function() {
      const preNoConflict = Marionette.Toolkit.noConflict();
      expect(Marionette.Toolkit).to.equal(undefined);
      Marionette.Toolkit = preNoConflict;
    });
  });
});

describe('Marionette.Toolkit.MixinState', function() {
  describe('when classDefinition has no StateModel definition', function() {
    it('should use the StateModel defined on StateMixin', function() {
      const MyClass = Marionette.Object.extend();
      Marionette.Toolkit.MixinState(MyClass);

      const myStateModel = new MyClass.prototype.StateModel();

      expect(myStateModel).to.be.an.instanceOf(Backbone.Model);
    });
  });

  describe('when classDefinition has StateModel definition', function() {
    it('should use the StateModel defined on classDefinition', function() {
      const MyModel = Backbone.Model.extend({
        foo: 'bar'
      });

      const MyClass = Marionette.Object.extend({
        StateModel: MyModel
      });

      Marionette.Toolkit.MixinState(MyClass);

      const myStateModel = new MyClass.prototype.StateModel();

      expect(myStateModel).to.be.an.instanceof(MyModel);
    });
  });
});
