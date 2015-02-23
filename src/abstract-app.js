import _ from 'underscore';
import Marionette from 'backbone.marionette';
import StateClass from './state-class';

/**
 * StateClass with an `initialize` / `start` / `stop` / `destroy` lifecycle.
 * Registers events while running and cleans them up at `onStop`
 *
 * @public
 * @class AbstractApp
 * @memberOf Toolkit
 * @memberOf Marionette
 */
var AbstractApp = StateClass.extend({

  /**
   * Internal flag indiciate when `App` has started but has not yet stopped.
   *
   * @private
   * @type {Boolean}
   * @default false
   */
  _isRunning: false,

  /**
   * Internal flag indiciate when `App` has been destroyed
   *
   * @private
   * @type {Boolean}
   * @default false
   */
  _isDestroyed: false,

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
   * @constructs AbstractApp
   * @param {Object} [options] - Settings for the App.
   * @param {Boolean} [options.startWithParent]
   * @param {Boolean} [options.stopWithParent]
   * @param {Boolean} [options.startAfterInitialized]
   * @param {Boolean} [options.preventDestroy]
   */
  constructor: function(options) {
    options = options || {};

    _.bindAll(this, 'start', 'stop');

    var pickOptions = [
      'startWithParent',
      'stopWithParent',
      'startAfterInitialized',
      'preventDestroy'
    ];

    _.extend(this, _.pick(options, pickOptions));

    // Will call initialize
    StateClass.call(this, options);

    if(_.result(this, 'startAfterInitialized')) {
      this.start();
    }
  },

  /**
   * Internal helper to verify if `App` has been destroyed
   *
   * @private
   * @method _ensureAppIsIntact
   * @memberOf AbstractApp
   * @throws AppDestroyedError - Thrown if `App` has already been destroyed
   */
  _ensureAppIsIntact: function() {
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
   * @memberOf AbstractApp
   * @returns {Boolean}
   */
  isRunning: function() {
    return this._isRunning;
  },

  /**
   * Sets the app lifecycle to running.
   *
   * @public
   * @method start
   * @memberOf AbstractApp
   * @param {Object} [options] - Settings for the App passed through to events
   * @event AbstractApp#before:start - passes options
   * @event AbstractApp#start - passes options
   * @returns {AbstractApp}
   */
  start: function(options) {
    this._ensureAppIsIntact();

    if(this._isRunning) {
      return this;
    }

    this.triggerMethod('before:start', options);

    this._isRunning = true;

    this.triggerMethod('start', options);

    return this;
  },

  /**
   * Sets the app lifecycle to not running.
   * Removes any listeners added during the running state
   *
   * @public
   * @method stop
   * @memberOf AbstractApp
   * @param {Object} [options] - Settings for the App passed through to events
   * @event AbstractApp#before:stop - passes options
   * @event AbstractApp#stop - passes options
   * @returns {AbstractApp}
   */
  stop: function(options) {
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
   * Gets the value of internal `_isDestroyed` flag
   *
   * @public
   * @method isDestroyed
   * @memberOf AbstractApp
   * @returns {Boolean}
   */
  isDestroyed: function() {
    return this._isDestroyed;
  },

  /**
   * Stops the `App` and sets it destroyed.
   *
   * @public
   * @method destroy
   * @memberOf AbstractApp
   */
  destroy: function() {
    this.stop();

    this._isDestroyed = true;

    StateClass.prototype.destroy.apply(this, arguments);
  },

  /**
   * Internal method to stop any registered events.
   *
   * @private
   * @method _stopRunningEvents
   * @memberOf AbstractApp
   */
  _stopRunningEvents: function(){
    _.each(this._runningEvents, function(args) {
      this.off.apply(this, args);
    }, this);
  },

  /**
   * Internal method to stop any registered listeners.
   *
   * @private
   * @method _stopRunningListeners
   * @memberOf AbstractApp
   */
  _stopRunningListeners: function(){
    _.each(this._runningListeningTo, function(args) {
      this.stopListening.apply(this, args);
    }, this);
  },

  /**
   * Overrides `Backbone.Event.on()`
   * If this `App` is running it will register the event for removal `onStop`
   *
   * @public
   * @method on
   * @memberOf AbstractApp
   * @returns {AbstractApp}
   */
  on: function() {
    if(this._isRunning) {
      this._runningEvents = (this._runningEvents || []);
      this._runningEvents.push(arguments);
    }
    return StateClass.prototype.on.apply(this, arguments);
  },

  /**
   * Overrides `Backbone.Event.listenTo()`
   * If this `App` is running it will register the listener for removal `onStop`
   *
   * @public
   * @method listenTo
   * @memberOf AbstractApp
   * @returns {AbstractApp}
   */
  listenTo: function() {
    if(this._isRunning) {
      this._runningListeningTo = (this._runningListeningTo || []);
      this._runningListeningTo.push(arguments);
    }
    return StateClass.prototype.listenTo.apply(this, arguments);
  }

});

export default AbstractApp;
