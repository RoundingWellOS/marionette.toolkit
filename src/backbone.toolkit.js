import Backbone from 'backbone';
import $ from 'jquery';
Backbone.$ = $;
import Marionette from 'backbone.marionette';

import StateClass from './state-class';
import Subapp from './subapp';

/**
 * @module Toolkit
 */
var Toolkit = Marionette.Toolkit = {};

Toolkit.StateClass = StateClass;

Toolkit.Subapp = Subapp;

export default Toolkit;
