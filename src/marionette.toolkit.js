import _ from 'underscore';

import StateMixin from './mixins/state';
import App from './app';
import Component from './component';

import { version as VERSION } from '../package.json';

/**
 * @module Toolkit
 */

function mixinState(classDefinition) {
  let _StateMixin = StateMixin;

  if (classDefinition.prototype.StateModel) {
    _StateMixin = _.omit(StateMixin, 'StateModel');
  }

  _.extend(classDefinition.prototype, _StateMixin);
}

export {
  App,
  Component,
  mixinState,
  StateMixin,
  VERSION
};
