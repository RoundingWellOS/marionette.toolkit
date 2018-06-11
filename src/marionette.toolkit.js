import _ from 'underscore';
import * as Toolkit from './marionette.toolkit.js';

import StateMixin from './mixins/state';
import App from './app';
import Component from './component';

/**
 * @module Toolkit
 */

const VERSION = '<%VERSION%>';

function MixinState(classDefinition) {
  let _StateMixin = StateMixin;

  if(classDefinition.prototype.StateModel) {
    _StateMixin = _.omit(StateMixin, 'StateModel');
  }

  _.extend(classDefinition.prototype, _StateMixin);
}

export {
  MixinState,
  VERSION,
  StateMixin,
  App,
  Component
};

export default Toolkit;
