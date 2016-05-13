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

Toolkit.VERSION = '<%VERSION%>';

Toolkit.StateMixin = StateMixin;

Toolkit.App = App;

Toolkit.Component = Component;

export default Toolkit;
