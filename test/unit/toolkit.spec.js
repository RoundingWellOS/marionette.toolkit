import Backbone from 'backbone';
import { MnObject } from 'backbone.marionette';
import { MixinState } from '../../src/marionette.toolkit';

describe('MixinState', function() {
  describe('when classDefinition has no StateModel definition', function() {
    it('should use the StateModel defined on StateMixin', function() {
      const MyClass = MnObject.extend();
      MixinState(MyClass);

      const myStateModel = new MyClass.prototype.StateModel();

      expect(myStateModel).to.be.an.instanceOf(Backbone.Model);
    });
  });

  describe('when classDefinition has StateModel definition', function() {
    it('should use the StateModel defined on classDefinition', function() {
      const MyModel = Backbone.Model.extend({
        foo: 'bar'
      });

      const MyClass = MnObject.extend({
        StateModel: MyModel
      });

      MixinState(MyClass);

      const myStateModel = new MyClass.prototype.StateModel();

      expect(myStateModel).to.be.an.instanceof(MyModel);
    });
  });
});
