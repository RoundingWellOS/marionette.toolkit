describe('Marionette.Toolkit.noConflict()', function () {

  describe('when calling noConflict', function () {
    it('should make Marionette.Toolkit return undefined', function () {
      var preNoConflict = Marionette.Toolkit.noConflict();
      expect(Marionette.Toolkit).to.equal(undefined);
      Marionette.Toolkit = preNoConflict;
    });
  });
});
