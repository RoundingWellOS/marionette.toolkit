describe('Marionette.Toolkit.noConflict()', function () {
  afterEach(function () {
    Marionette.Toolkit = global.preNoConflict;
  });

  describe('when calling noConflict', function () {
    it('should make Marionette.Toolkit return undefined', function () {
      global.preNoConflict = Marionette.Toolkit.noConflict();
      expect(Marionette.Toolkit).to.equal(undefined);
    });
  });
});
