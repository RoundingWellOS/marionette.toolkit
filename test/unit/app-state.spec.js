import App from '../../src/app';

describe('App StateModel', function() {
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
});
