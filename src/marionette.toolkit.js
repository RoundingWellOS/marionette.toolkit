import Marionette from 'backbone.marionette';

import './class-shim';

import StateClass from './state-class';
import App from './app';
import Component from './component';

/**
 * @module Toolkit
 */

var previousToolkit = Marionette.Toolkit;

var Toolkit = Marionette.Toolkit = {};

Toolkit.noConflict = function() {
  Marionette.Toolkit = previousToolkit;
  return this;
};

Toolkit.VERSION = '<%= version %>';

Toolkit.StateClass = StateClass;

Toolkit.App = App;

Toolkit.Component = Component;

export default Toolkit;
