import Marionette from 'backbone.marionette';
import StateMixin from './state-mixin';

/**
 * Marionette.Class with a Backbone.Model for keeping state.
 *
 * @public
 * @class StateClass
 * @memberOf Toolkit
 * @memberOf Marionette
 */
var StateClass = Marionette.Class.extend();

StateClass.mixin(StateMixin);

export default StateClass;
