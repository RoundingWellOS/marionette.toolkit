module.exports = function() {
  var _ = require('underscore');
  var Backbone = require('backbone');
  var $ = require('jquery');
  Backbone.$ = $;
  var Marionette = require('backbone.marionette');

  before(function() {
    global._ = _;
    global.Backbone = Backbone;
    global.Marionette = Marionette;
    global.expect = global.chai.expect;
  });

  beforeEach(function() {
    this.sinon = global.sinon.sandbox.create();
    global.stub = this.sinon.stub.bind(this.sinon);
    global.spy  = this.sinon.spy.bind(this.sinon);
  });

  afterEach(function() {
    delete global.stub;
    delete global.spy;
    this.sinon.restore();
  });
};
