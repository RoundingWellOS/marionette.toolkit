/**
 * marionette.toolkit - A collection of opinionated Backbone.Marionette extensions for large scale application architecture.
 * @version v0.4.1
 * @link https://github.com/RoundingWellOS/marionette.toolkit
 * @license MIT
 */
"use strict";

var _ = require("underscore");
var Marionette = require("backbone.marionette");
var StateClass = require("marionette.toolkit.state-class");

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
  constructor: function constructor(options) {
    options = _.extend({}, options);

    _.bindAll(this, "start", "stop");

    var pickOptions = ["startWithParent", "stopWithParent", "startAfterInitialized", "preventDestroy"];

    _.extend(this, _.pick(options, pickOptions));

    // Will call initialize
    StateClass.call(this, options);

    if (_.result(this, "startAfterInitialized")) {
      this.start(options);
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
  _ensureAppIsIntact: function _ensureAppIsIntact() {
    if (this._isDestroyed) {
      throw new Marionette.Error({
        name: "AppDestroyedError",
        message: "App has already been destroyed and cannot be used."
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
  isRunning: function isRunning() {
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
   * @returns {AbstractApp}
   */
  start: function start(options) {
    this._ensureAppIsIntact();

    if (this._isRunning) {
      return this;
    }

    this.triggerMethod("before:start", options);

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
   * @memberOf AbstractApp
   * @param {Object} [options] - Settings for the App passed through to events
   * @event AbstractApp#start - passes options
   * @returns
   */
  triggerStart: function triggerStart(options) {
    this.triggerMethod("start", options);
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
  stop: function stop(options) {
    if (!this._isRunning) {
      return this;
    }

    this.triggerMethod("before:stop", options);

    this._isRunning = false;

    this.triggerMethod("stop", options);

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
  isDestroyed: function isDestroyed() {
    return this._isDestroyed;
  },

  /**
   * Stops the `App` and sets it destroyed.
   *
   * @public
   * @method destroy
   * @memberOf AbstractApp
   */
  destroy: function destroy() {
    if (this._isDestroyed) {
      return;
    }

    this._isDestroyed = true;

    this.stop();

    StateClass.prototype.destroy.apply(this, arguments);
  },

  /**
   * Internal method to stop any registered events.
   *
   * @private
   * @method _stopRunningEvents
   * @memberOf AbstractApp
   */
  _stopRunningEvents: function _stopRunningEvents() {
    _.each(this._runningEvents, function (args) {
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
  _stopRunningListeners: function _stopRunningListeners() {
    _.each(this._runningListeningTo, function (args) {
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
  on: function on() {
    if (this._isRunning) {
      this._runningEvents = this._runningEvents || [];
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
  listenTo: function listenTo() {
    if (this._isRunning) {
      this._runningListeningTo = this._runningListeningTo || [];
      this._runningListeningTo.push(arguments);
    }
    return StateClass.prototype.listenTo.apply(this, arguments);
  },

  /**
   * Overrides `Backbone.Event.listenToOnce()`
   * If this `App` is running it will register the listener for removal `onStop`
   *
   * @public
   * @method listenToOnce
   * @memberOf AbstractApp
   * @returns {AbstractApp}
   */
  listenToOnce: function listenToOnce() {
    if (this._isRunning) {
      this._runningListeningTo = this._runningListeningTo || [];
      this._runningListeningTo.push(arguments);
    }

    return StateClass.prototype.listenToOnce.apply(this, arguments);
  }
});

var abstract_app = AbstractApp;

var App = abstract_app.extend({

  /**
   * @public
   * @constructs App
   * @param {Object} [options] - Settings for the App.
   * @param {Object} [options.childApps] - Hash for setting up child apps.
   *
   * ```js
   * childApps: {
   *   appName: {
   *     AppClass: MyChildAppClass,
   *     fooOption: true,
   *     startWithParent: true
   *   },
   *   barApp: MyOtherChildAppClass
   * }
   * ```
   */
  constructor: function constructor(options) {
    options = _.extend({}, options);

    this._childApps = {};

    _.extend(this, _.pick(options, ["childApps"]));

    this._initChildApps(options);

    // The child apps should be handled while the app is running;
    // After start, before stop, and before destroy.
    this.on({
      start: this._startChildApps,
      "before:stop": this._stopChildApps,
      "before:destroy": this._destroyChildApps
    });

    abstract_app.call(this, options);
  },

  /**
   * Initializes `childApps` option
   *
   * @private
   * @method _initChildApps
   * @memberOf App
   */
  _initChildApps: function _initChildApps(options) {
    var childApps = this.childApps;

    if (childApps) {

      if (_.isFunction(childApps)) {
        childApps = childApps.call(this, options);
      }

      this.addChildApps(childApps);
    }
  },

  /**
   * Starts `childApps` if allowed by child
   *
   * @private
   * @method _startChildApps
   * @memberOf App
   */
  _startChildApps: function _startChildApps() {
    _.each(this._childApps, function (childApp) {
      if (_.result(childApp, "startWithParent")) {
        childApp.start();
      }
    });
  },

  /**
   * Stops `childApps` if allowed by child
   *
   * @private
   * @method _stopChildApps
   * @memberOf App
   */
  _stopChildApps: function _stopChildApps() {
    _.each(this._childApps, function (childApp) {
      if (_.result(childApp, "stopWithParent")) {
        childApp.stop();
      }
    });
  },

  /**
   * Destroys `childApps` if allowed by child
   *
   * @private
   * @method _destroyChildApps
   * @memberOf App
   */
  _destroyChildApps: function _destroyChildApps() {
    _.each(this._childApps, function (childApp) {
      if (!_.result(childApp, "preventDestroy")) {
        childApp.destroy();
      }
    });
  },

  /**
   * Internal helper to instantiate and `App` from on `Object`
   *
   * @private
   * @method _buildAppFromObject
   * @memberOf App
   * @param {Object} appConfig - `AppClass` and any other option for the `App`
   * @returns {App}
   */
  _buildAppFromObject: function _buildAppFromObject(appConfig) {
    var AppClass = appConfig.AppClass;
    var options = _.omit(appConfig, "AppClass");

    return this.buildApp(AppClass, options);
  },

  /**
   * Helper for building an App and return it
   *
   * @private
   * @method _buildApp
   * @memberOf App
   * @param {App} AppClass - An App Class
   * @param {Object} AppClass - Optionally passed as an appConfig Object
   * @param {Object} [options] - options for the AppClass
   * @returns {App}
   */
  _buildApp: function _buildApp(AppClass, options) {
    if (_.isFunction(AppClass)) {
      return this.buildApp(AppClass, options);
    }
    if (_.isObject(AppClass)) {
      return this._buildAppFromObject(AppClass);
    }
  },

  /**
   * Build an App and return it
   * Override for dynamic App building
   *
   * @public
   * @method buildApp
   * @memberOf App
   * @param {App} [AppClass] - An App Class
   * @param {Object} [options] - options for the AppClass
   * @returns {App}
   */
  buildApp: function buildApp(AppClass, options) {
    return new AppClass(options);
  },

  /**
   * Internal helper to verify `appName` is unique and not in use
   *
   * @private
   * @method _ensureAppIsUnique
   * @memberOf App
   * @param {String} appName - Name of app to test
   * @throws DuplicateChildAppError - Thrown if `App` already has an `appName` registered
   */
  _ensureAppIsUnique: function _ensureAppIsUnique(appName) {
    if (this._childApps[appName]) {
      throw new Marionette.Error({
        name: "DuplicateChildAppError",
        message: "A child App with name \"" + appName + "\" has already been added."
      });
    }
  },

  /**
   * Add child `App`s to this `App`
   *
   * @public
   * @method addChildApps
   * @memberOf App
   * @param {Object} childApps - Hash of names and `AppClass` or `appConfig`
   */
  addChildApps: function addChildApps(childApps) {
    _.each(childApps, function (childApp, appName) {
      this.addChildApp(appName, childApp);
    }, this);
  },

  /**
   * Build's childApp and registers it with this App
   * Starts the childApp, if this app is running and child is `startWithParent`
   *
   * @public
   * @method addChildApp
   * @memberOf App
   * @param {String} appName - Name of App to register
   * @param {App} AppClass - An App Class
   * @param {Object} AppClass - Optionally passed as an appConfig Object
   * @param {Object} [options] - options for the AppClass
   * @throws AddChildAppError - Thrown if no childApp could be built from params
   * @returns {App}
   */
  addChildApp: function addChildApp(appName, AppClass, options) {
    this._ensureAppIsUnique(appName);

    var childApp = this._buildApp(AppClass, options);

    if (!childApp) {
      throw new Marionette.Error({
        name: "AddChildAppError",
        message: "App build failed.  Incorrect configuration."
      });
    }

    childApp._name = appName;

    this._childApps[appName] = childApp;

    // When the app is destroyed remove the cached app.
    childApp.on("destroy", _.partial(this._removeChildApp, appName), this);

    if (this.isRunning() && _.result(childApp, "startWithParent")) {
      childApp.start();
    }

    return childApp;
  },

  /**
   * Returns registered child `App`s name
   *
   * @public
   * @method getName
   * @memberOf App
   * @returns {String}
   */
  getName: function getName() {
    return this._name;
  },

  /**
   * Returns registered child `App`s array
   *
   * @public
   * @method getChildApps
   * @memberOf App
   * @returns {Array}
   */
  getChildApps: function getChildApps() {
    return _.clone(this._childApps);
  },

  /**
   * Returns registered child `App`
   *
   * @public
   * @method getChildApp
   * @memberOf App
   * @param {String} appName - Name of App to retrieve
   * @returns {App}
   */
  getChildApp: function getChildApp(appName) {
    return this._childApps[appName];
  },

  /**
   * Internal helper.  Unregisters child `App`
   *
   * @private
   * @method _removeChildApp
   * @memberOf App
   * @param {String} appName - Name of App to unregister
   * @returns {App}
   */
  _removeChildApp: function _removeChildApp(appName) {
    delete this._childApps[appName]._name;
    delete this._childApps[appName];
  },

  /**
   * Removes all childApps and returns them.
   * The return is useful if any app is using `preventDestroy`
   *
   * @public
   * @method removeChildApps
   * @memberOf App
   * @returns {Array}
   */
  removeChildApps: function removeChildApps() {
    var childApps = this.getChildApps();

    _.each(this._childApps, function (childApp, appName) {
      this.removeChildApp(appName);
    }, this);

    return childApps;
  },

  /**
   * Destroys or removes registered child `App` by name
   * depending on `preventDestroy`
   *
   * @public
   * @method removeChildApp
   * @memberOf App
   * @param {String} appName - Name of App to destroy
   * @param {Object} [options.preventDestroy] - Flag to remove but prevent App destroy
   * @returns {App}
   */
  removeChildApp: function removeChildApp(appName, options) {
    options = _.extend({}, options);

    var childApp = this.getChildApp(appName);

    if (!childApp) {
      return;
    }

    // if preventDestroy simply unregister the child app
    if (options.preventDestroy || _.result(childApp, "preventDestroy")) {
      this._removeChildApp(appName);
    } else {
      childApp.destroy();
    }

    return childApp;
  }

});

var app = App;

module.exports = app;
//# sourceMappingURL=./App.js.map