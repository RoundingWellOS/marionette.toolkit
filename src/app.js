import _ from 'underscore';
import Marionette from 'backbone.marionette';
import StateMixin from './mixins/state';
import ChildAppsMixin from './mixins/child-apps';
import EventListenersMixin from './mixins/event-listeners';

const ClassOptions = [
  'startWithParent',
  'stopWithParent',
  'startAfterInitialized',
  'preventDestroy'
];

/**
 * Marionette.Object with an `initialize` / `start` / `stop` / `destroy` lifecycle.
 *
 * @public
 * @class App
 * @memberOf Toolkit
 * @memberOf Marionette
 */
const App = Marionette.Application.extend({

  /**
   * Internal flag indiciate when `App` has started but has not yet stopped.
   *
   * @private
   * @type {Boolean}
   * @default false
   */
  _isRunning: false,

  /**
   * Set to true if a parent `App` should not be able to destroy this `App`.
   *
   * @type {Boolean|Function}
   * @default false
   */
  preventDestroy: false,

  /**
   * Set to true if `App` should be started after it is initialized.
   *
   * @type {Boolean|Function}
   * @default false
   */
  startAfterInitialized: false,

  /**
   * Set to true if `App` should be started after its parent starts.
   *
   * @type {Boolean|Function}
   * @default false
   */
  startWithParent: false,

  /**
   * Set to false if `App` should not stop after its parent stops.
   *
   * @type {Boolean|Function}
   * @default true
   */
  stopWithParent: true,

  /**
   * @public
   * @constructs App
   * @param {Object} [options] - Settings for the App.
   * @param {Boolean} [options.startWithParent]
   * @param {Boolean} [options.stopWithParent]
   * @param {Boolean} [options.startAfterInitialized]
   * @param {Boolean} [options.preventDestroy]
   * @param {Object} [options.state] - Attributes to set on the state model.
   */
  constructor(options = {}) {
    _.bindAll(this, 'start', 'stop');

    this.mergeOptions(options, ClassOptions);

    this.initState(options);
    this._initChildApps(options);

    Marionette.Application.call(this, options);

    if(_.result(this, 'startAfterInitialized')) {
      this.start(options);
    }
  },

  /**
   * Internal helper to verify if `App` has been destroyed
   *
   * @private
   * @method _ensureAppIsIntact
   * @memberOf App
   * @throws AppDestroyedError - Thrown if `App` has already been destroyed
   */
  _ensureAppIsIntact() {
    if(this._isDestroyed) {
      throw new Marionette.Error({
        name: 'AppDestroyedError',
        message: 'App has already been destroyed and cannot be used.'
      });
    }
  },

  /**
   * Gets the value of internal `_isRunning` flag
   *
   * @public
   * @method isRunning
   * @memberOf App
   * @returns {Boolean}
   */
  isRunning() {
    return this._isRunning;
  },

  /**
   * Sets the app lifecycle to running.
   *
   * @public
   * @method start
   * @memberOf App
   * @param {Object} [options] - Settings for the App passed through to events
   * @event App#before:start - passes options
   * @returns {App}
   */
  start(options) {
    this._ensureAppIsIntact();

    if(this._isRunning) {
      return this;
    }

    this.triggerMethod('before:start', options);

    this._isRunning = true;

    this.triggerStart(options);

    return this;
  },

  /**
   * Triggers start event.
   * Override to introduce async start
   *
   * @public
   * @method triggerStart
   * @memberOf App
   * @param {Object} [options] - Settings for the App passed through to events
   * @event App#start - passes options
   * @returns
   */
  triggerStart(options) {
    this.triggerMethod('start', options);
  },

  /**
   * "Restarts the app" by first stoping app, reinitializing state, and then starting the app again
   *
   *
   * @public
   * @method restart
   * @memberOf App
   * @param {Object} [options] - Settings for the App passed through to events
   * @returns {App}
   */
  restart(options) {
    this.stop(options);
    this.initState(options);
    this.start(options);

    return this;
  },

  /**
   * Sets the app lifecycle to not running.
   * Removes any listeners added during the running state
   *
   * @public
   * @method stop
   * @memberOf App
   * @param {Object} [options] - Settings for the App passed through to events
   * @event App#before:stop - passes options
   * @event App#stop - passes options
   * @returns {App}
   */
  stop(options) {
    if(!this._isRunning) {
      return this;
    }

    this.triggerMethod('before:stop', options);

    this._isRunning = false;

    this.triggerMethod('stop', options);

    this._stopRunningListeners();
    this._stopRunningEvents();

    return this;
  },

  /**
   * Stops the `App` and sets it destroyed.
   *
   * @public
   * @method destroy
   * @memberOf App
   */
  destroy() {
    if(this._isDestroyed) {
      return;
    }

    this.stop();

    Marionette.Object.prototype.destroy.apply(this, arguments);
  }
});

_.extend(App.prototype, StateMixin, ChildAppsMixin, EventListenersMixin);

export default App;
