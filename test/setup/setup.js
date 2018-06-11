import _ from 'underscore';
import Backbone from 'backbone';
import * as Marionette from 'backbone.marionette';

module.exports = function() {
  const $ = require('jquery');
  Backbone.$ = $;
  Marionette.Toolkit = require('../../src/marionette.toolkit');

  // Set up test div
  const $testDiv = $('#testDiv');

  const setFixtures = function() {
    _.each(arguments, function(content) {
      $testDiv.append(content);
    });
  };

  const clearFixtures = function() {
    $testDiv.empty();
  };

  before(function() {
    global._ = _;
    global.Backbone = Backbone;
    global.Marionette = Marionette;
    global.expect = global.chai.expect;
  });

  beforeEach(function() {
    this.sinon = global.sinon.sandbox.create();
    global.stub = this.sinon.stub.bind(this.sinon);
    global.spy = this.sinon.spy.bind(this.sinon);
    this.setFixtures = setFixtures;
    this.clearFixtures = clearFixtures;
  });

  afterEach(function() {
    delete global.stub;
    delete global.spy;
    this.sinon.restore();
    clearFixtures();
  });
};
