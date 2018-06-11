describe('Marionette.Toolkit.MixinState', function() {
  describe('when classDefinition has no StateModel definition', function() {
    it('should use the StateModel defined on StateMixin', function() {
      const MyClass = Marionette.MnObject.extend();
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

      const MyClass = Marionette.MnObject.extend({
        StateModel: MyModel
      });

      Marionette.Toolkit.MixinState(MyClass);

      const myStateModel = new MyClass.prototype.StateModel();

      expect(myStateModel).to.be.an.instanceof(MyModel);
    });
  });
});
