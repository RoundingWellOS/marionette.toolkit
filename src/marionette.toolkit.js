import _ from 'underscore';

import StateMixin from './mixins/state';
import App from './app';
import Component from './component';

import { version as VERSION } from '../package.json';

/**
 * @module Toolkit
 */

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
