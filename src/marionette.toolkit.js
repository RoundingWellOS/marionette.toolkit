import Marionette from 'backbone.marionette';

import StateClass from './state-class';
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

Toolkit.StateClass = StateClass;

Toolkit.App = App;

Toolkit.Component = Component;

export default Toolkit;
