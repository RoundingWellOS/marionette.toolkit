module.exports = function() {
  const $ = require('jquery');
  const _ = require('underscore');
  const Backbone = require('backbone');
  Backbone.$ = $;

  // Set up test div
  let $fixtures;

  const setFixtures = function() {
    _.each(arguments, function(content) {
      $fixtures.append(content);
    });
  };

  const clearFixtures = function() {
    $fixtures.empty();
  };

  before(function() {
    $fixtures = $('<div id="fixtures">');
    $('body').append($fixtures);
    global.expect = global.chai.expect;
  });

  beforeEach(function() {
    this.sinon = global.sinon.createSandbox();
    this.setFixtures = setFixtures;
    this.clearFixtures = clearFixtures;
  });

  afterEach(function() {
    this.sinon.restore();
    clearFixtures();
  });
};
