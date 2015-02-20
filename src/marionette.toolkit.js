import Marionette from 'backbone.marionette';

import StateClass from './state-class';
import App from './app';
import Component from './component';

/**
 * @module Toolkit
 */
var Toolkit = Marionette.Toolkit = {};

Toolkit.StateClass = StateClass;

Toolkit.App = App;

Toolkit.Component = Component;
