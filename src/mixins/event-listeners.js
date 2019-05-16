import _ from 'underscore';
import { MnObject } from 'backbone.marionette';

/**
 * This provides methods used for registering events while App is running and cleans them up at `onStop`. It's not meant to
 * be used directly.
 *
 * @mixin
 */

export default {
  /**
   * Internal method to stop any registered events.
   *
   * @private
   * @method _stopRunningEvents
   */
  _stopRunningEvents() {
    _.each(this._runningEvents, _.bind(function(args) {
      this.off.apply(this, args);
    }, this));
  },

  /**
   * Internal method to stop any registered listeners.
   *
   * @private
   * @method _stopRunningListeners
   */
  _stopRunningListeners() {
    _.each(this._runningListeningTo, _.bind(function(args) {
      this.stopListening.apply(this, args);
    }, this));
  },

  /**
   * Overrides `Backbone.Event.on()`
   * If this `App` is running it will register the event for removal `onStop`
   *
   * @public
   * @method on
   * @returns {EventListeners}
   */
  on() {
    if (this._isRunning) {
      this._runningEvents = (this._runningEvents || []);
      this._runningEvents.push(arguments);
    }

    return MnObject.prototype.on.apply(this, arguments);
  },

  /**
   * Keep a copy of non-running on for internal use
   *
   * @private
   * @method _on
   * @returns {EventListeners}
   */
  _on: MnObject.prototype.on,

  /**
   * Overrides `Backbone.Event.listenTo()`
   * If this `App` is running it will register the listener for removal `onStop`
   *
   * @public
   * @method listenTo
   * @returns {EventListeners}
   */
  listenTo() {
    if (this._isRunning) {
      this._runningListeningTo = (this._runningListeningTo || []);
      this._runningListeningTo.push(arguments);
    }
    return MnObject.prototype.listenTo.apply(this, arguments);
  },

  /**
   * Keep a copy of non-running on for internal use
   *
   * @private
   * @method _listenTo
   * @returns {EventListeners}
   */
  _listenTo: MnObject.prototype.listenTo,

  /**
   * Overrides `Backbone.Event.listenToOnce()`
   * If this `App` is running it will register the listener for removal `onStop`
   *
   * @public
   * @method listenToOnce
   * @returns {EventListeners}
   */
  listenToOnce() {
    if (this._isRunning) {
      this._runningListeningTo = (this._runningListeningTo || []);
      this._runningListeningTo.push(arguments);
    }

    return MnObject.prototype.listenToOnce.apply(this, arguments);
  }
};
