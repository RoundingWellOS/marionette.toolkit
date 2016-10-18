import _ from 'underscore';
import Marionette from 'backbone.marionette';

import StateMixin from './mixins/state';
import App from './app';
import Component from './component';

/**
 * @module Toolkit
 */

const previousToolkit = Marionette.Toolkit;

const Toolkit = Marionette.Toolkit = {};

Toolkit.noConflict = function() {
  Marionette.Toolkit = previousToolkit;
  return this;
};

Toolkit.MixinState = function(classDefinition) {
  let _StateMixin = StateMixin;

  if(classDefinition.prototype.StateModel) {
    _StateMixin = _.omit(StateMixin, 'StateModel');
  }

  _.extend(classDefinition.prototype, _StateMixin);
};

Toolkit.VERSION = '<%VERSION%>';

Toolkit.StateMixin = StateMixin;

Toolkit.App = App;

Toolkit.Component = Component;

export default Toolkit;
