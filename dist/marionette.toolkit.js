/**
 * marionette.toolkit - A collection of opinionated Backbone.Marionette extensions for large scale application architecture.
 * @version v6.3.0
 * @link https://github.com/RoundingWellOS/marionette.toolkit
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('underscore'), require('backbone'), require('backbone.marionette')) :
  typeof define === 'function' && define.amd ? define(['exports', 'underscore', 'backbone', 'backbone.marionette'], factory) :
  (global = global || self, (function () {
    var current = global.Toolkit;
    var exports = global.Toolkit = {};
    factory(exports, global._, global.Backbone, global.Marionette);
    exports.noConflict = function () { global.Toolkit = current; return exports; };
  }()));
}(this, function (exports, _, Backbone, backbone_marionette) { 'use strict';

  _ = _ && _.hasOwnProperty('default') ? _['default'] : _;
  Backbone = Backbone && Backbone.hasOwnProperty('default') ? Backbone['default'] : Backbone;

  var ClassOptions = ['StateModel', 'stateEvents'];
  /**
   * This provides methods used for keeping state using a Backbone.Model. It's meant to
   * be used with either a Marionette.MnObject or Backbone.View.
   *
   * @mixin
   */

  var StateMixin = {
    /**
     * The model class for _stateModel.
     * @type {Backbone.Model}
     * @default Backbone.Model
     */
    StateModel: Backbone.Model,

    /**
     * @public
     * @method initState
     * @param {Object} [options] - Settings for the StateMixin.
     * @param {Object} [options.stateEvents] - Event hash bound from _stateModel to StateMixin.
     * @param {Backbone.Model} [options.StateModel] - Model class for _stateModel.
     */
    initState: function initState() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this._initState(options);

      this.delegateStateEvents();
      return this;
    },

    /**
     * @private
     * @method _initState
     * @param {Object} [options] - Settings for the StateMixin.
     */
    _initState: function _initState(options) {
      // Make defaults available to this
      this.mergeOptions(options, ClassOptions); // Remove event handlers from previous state

      this._removeEventHandlers();

      var StateModel = this._getStateModel(options);

      this._stateModel = new StateModel(options.state);

      this._setEventHandlers();
    },

    /**
     * Bind events from the _stateModel defined in stateEvents hash
     *
     * @public
     * @method delegateStateEvents
     */
    delegateStateEvents: function delegateStateEvents() {
      this.undelegateStateEvents();
      this.bindEvents(this._stateModel, _.result(this, 'stateEvents'));
      return this;
    },

    /**
     * Unbind all entity events on _stateModel
     *
     * @public
     * @method undelegateStateEvents
     */
    undelegateStateEvents: function undelegateStateEvents() {
      this.unbindEvents(this._stateModel);
      return this;
    },

    /**
     * Setup destroy event handle
     *
     * @private
     * @method _setEventHandlers
     */
    _setEventHandlers: function _setEventHandlers() {
      this.on('destroy', this._destroyState);
    },

    /**
     * Clean up destroy event handler, remove any listeners on _stateModel
     *
     * @private
     * @method _removeEventHandlers
     */
    _removeEventHandlers: function _removeEventHandlers() {
      if (!this._stateModel) {
        return;
      }

      this.undelegateStateEvents();

      this._stateModel.stopListening();

      this.off('destroy', this._destroyState);
    },

    /**
     * Get the StateMixin StateModel class.
     * Checks if the `StateModel` is a model class (the common case)
     * Then check if it's a function (which we assume that returns a model class)
     *
     * @private
     * @method _getStateModel
     * @param {Object} [options] - Options that can be used to determine the StateModel.
     * @returns {Backbone.Model}
     */
    _getStateModel: function _getStateModel(options) {
      if (this.StateModel.prototype instanceof Backbone.Model || this.StateModel === Backbone.Model) {
        return this.StateModel;
      } else if (_.isFunction(this.StateModel)) {
        return this.StateModel.call(this, options);
      }

      throw new Error('"StateModel" must be a model class or a function that returns a model class');
    },

    /**
     * Set a property on the _stateModel.
     *
     * @public
     * @method setState
     * @param {String|Object} key - Attribute name or Hash of any number of key value pairs.
     * @param {*} [value] - Attribute value if key is String, replaces options param otherwise.
     * @param {Object} [options] - Backbone.Model options.
     * @returns {Backbone.Model} - The _stateModel
     */
    setState: function setState() {
      return this._stateModel.set.apply(this._stateModel, arguments);
    },

    /**
     *  Reset _stateModel to defined defaults
     *
     * @public
     * @method resetStateDefaults
     * @param {Object} [newState] - Hash of any number of key value pairs.
     * @returns {Backbone.Model|*} - The _stateModel or the attribute value of the _stateModel
     */
    resetStateDefaults: function resetStateDefaults() {
      var defaults = _.result(this._stateModel, 'defaults');

      return this._stateModel.set(defaults);
    },

    /**
     * Get a property from the _stateModel, or return the _stateModel
     *
     * @public
     * @method getState
     * @param {String} [attr] - Attribute name of stateModel.
     * @returns {Backbone.Model|*} - The _stateModel or the attribute value of the _stateModel
     */
    getState: function getState(attr) {
      if (!attr) {
        return this._stateModel;
      }

      return this._stateModel.get.apply(this._stateModel, arguments);
    },

    /**
     * Toggle a property on the _stateModel.
     *
     * @public
     * @method toggleState
     * @param {String} attr - Attribute name of stateModel.
     * @param {val} [value] - Attribute value.
     * @returns {Backbone.Model} - The _stateModel or attribute value.
     */
    toggleState: function toggleState(attr, val) {
      if (arguments.length > 1) {
        return this._stateModel.set(attr, !!val);
      }

      return this._stateModel.set(attr, !this._stateModel.get(attr));
    },

    /**
     * Check if _stateModel has a property
     *
     * @public
     * @method hasState
     * @param {String} [attr] - Attribute name of stateModel.
     * @returns {Boolean}
     */
    hasState: function hasState(attr) {
      return this._stateModel.has(attr);
    },

    /**
     * Clean up any listeners on the _stateModel.
     *
     * @private
     * @method _destroyState
     */
    _destroyState: function _destroyState() {
      this._stateModel.stopListening();
    }
  };

  var ClassOptions$1 = ['childApps', 'childAppOptions'];
  /**
   * This provides methods used for "App Manager" functionality - the adding and removing child `App`s. It's not meant to
   * be used directly.
   *
   * @mixin
   */

  var ChildAppsMixin = {
    /**
     * @private
     * @method _initChildApps
     * @constructs ChildApps
     * @param {Object} [options] - Settings for the ChildApps.
     * @param {Object} [options.childApps] - Hash for setting up child apps.
     * @param {Object} [options.childAppOptions] - Hash of options passed to every child app.
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
    _initChildApps: function _initChildApps() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this._childApps = {};
      this.mergeOptions(options, ClassOptions$1);
      var childApps = this.childApps;

      if (childApps) {
        if (_.isFunction(childApps)) {
          childApps = childApps.call(this, options);
        }

        this.addChildApps(childApps);
      }
    },

    /**
     * Finds `regionName` and `getOptions` for the childApp
     *
     * @private
     * @method _getChildStartOpts
     */
    _getChildStartOpts: function _getChildStartOpts(childApp) {
      var _this = this;

      var tkOpts = childApp._tkOpts || {};
      var opts = {
        region: this.getRegion(tkOpts.regionName)
      };

      _.each(tkOpts.getOptions, function (opt) {
        opts[opt] = _this.getOption(opt);
      });

      return opts;
    },

    /**
     * Starts a `childApp`
     *
     * @private
     * @method _startChildApp
     */
    _startChildApp: function _startChildApp(childApp, options) {
      var opts = this._getChildStartOpts(childApp);

      return childApp.start(_.extend(opts, options));
    },

    /**
     * Handles explicit boolean values of restartWithParent
     * restartWithParent === false does nothing
     *
     * @private
     * @method _shouldStartWithRestart
     */
    _shouldActWithRestart: function _shouldActWithRestart(childApp, action) {
      if (!this._isRestarting) {
        return true;
      }

      var restartWithParent = _.result(childApp, 'restartWithParent');

      if (restartWithParent === true) {
        return true;
      }

      if (restartWithParent !== false && _.result(childApp, action)) {
        return true;
      }
    },

    /**
     * Starts `childApps` if allowed by child
     *
     * @private
     * @method _startChildApps
     */
    _startChildApps: function _startChildApps() {
      var _this2 = this;

      var action = 'startWithParent';

      _.each(this._childApps, function (childApp) {
        if (!_this2._shouldActWithRestart(childApp, action)) {
          return;
        }

        if (!_this2._isRestarting && !_.result(childApp, action)) {
          return;
        }

        _this2._startChildApp(childApp);
      });
    },

    /**
     * Stops `childApps` if allowed by child
     *
     * @private
     * @method _stopChildApps
     */
    _stopChildApps: function _stopChildApps() {
      var _this3 = this;

      var action = 'stopWithParent';

      _.each(this._childApps, function (childApp) {
        if (!_this3._shouldActWithRestart(childApp, action)) {
          return;
        }

        if (!_this3._isRestarting && !_.result(childApp, action)) {
          return;
        }

        childApp.stop();
      });
    },

    /**
     * Starts `childApp`
     *
     * @param {String} appName - Name of childApp to start
     * @param {Object} options - Start options for app
     * @public
     * @method startChildApp
     */
    startChildApp: function startChildApp(appName, options) {
      var childApp = this.getChildApp(appName);

      if (!childApp) {
        throw new Error("A child app with the name ".concat(appName, " does not exist."));
      }

      return this._startChildApp(childApp, options);
    },

    /**
     * Stops `childApp`
     *
     * @param {String} appName - Name of childApp to stop
     * @param {Object} options - Stop options for app
     * @public
     * @method stopChildApp
     */
    stopChildApp: function stopChildApp(appName, options) {
      return this.getChildApp(appName).stop(options);
    },

    /**
     * Destroys `childApps` if allowed by child
     *
     * @private
     * @method _destroyChildApps
     */
    _destroyChildApps: function _destroyChildApps() {
      _.each(this._childApps, function (childApp) {
        if (!_.result(childApp, 'preventDestroy')) {
          childApp.destroy();
        }
      });
    },

    /**
     * Internal helper to instantiate and `App` from on `Object`
     *
     * @private
     * @method _buildAppFromObject
     * @param {Object} appConfig - `AppClass` and any other option for the `App`
     * @returns {App}
     */
    _buildAppFromObject: function _buildAppFromObject(appConfig) {
      var AppClass = appConfig.AppClass;

      var options = _.omit(appConfig, 'AppClass', 'regionName', 'getOptions');

      var app = this.buildApp(AppClass, options);
      app._tkOpts = _.pick(appConfig, 'regionName', 'getOptions');
      return app;
    },

    /**
     * Helper for building an App and return it
     *
     * @private
     * @method _buildApp
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
     * @param {App} [AppClass] - An App Class
     * @param {Object} [options] - options for the AppClass
     * @returns {App}
     */
    buildApp: function buildApp(AppClass, options) {
      // options on childApp definition supersede childAppOptions
      options = _.extend({}, this.childAppOptions, options);
      return new AppClass(options);
    },

    /**
     * Internal helper to verify `appName` is unique and not in use
     *
     * @private
     * @method _ensureAppIsUnique
     * @param {String} appName - Name of app to test
     * @throws DuplicateChildAppError - Thrown if `App` already has an `appName` registered
     */
    _ensureAppIsUnique: function _ensureAppIsUnique(appName) {
      if (this._childApps[appName]) {
        throw new Error("A child App with name \"".concat(appName, "\" has already been added."));
      }
    },

    /**
     * Add child `App`s to this `App`
     *
     * @public
     * @method addChildApps
     * @param {Object} childApps - Hash of names and `AppClass` or `appConfig`
     */
    addChildApps: function addChildApps(childApps) {
      _.each(childApps, _.bind(function (childApp, appName) {
        this.addChildApp(appName, childApp);
      }, this));
    },

    /**
     * Build's childApp and registers it with this App
     * Starts the childApp, if this app is running and child is `startWithParent`
     *
     * @public
     * @method addChildApp
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
        throw new Error('App build failed.  Incorrect configuration.');
      }

      childApp._name = appName;
      this._childApps[appName] = childApp; // When the app is destroyed remove the cached app.
      // Listener setup relative to the childApp's running state (using _on)

      childApp._on('destroy', _.partial(this._removeChildApp, appName), this);

      if (this.isRunning() && _.result(childApp, 'startWithParent')) {
        this._startChildApp(childApp);
      }

      return childApp;
    },

    /**
     * Returns registered child `App`s name
     *
     * @public
     * @method getName
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
     * @returns {Array}
     */
    removeChildApps: function removeChildApps() {
      var childApps = this.getChildApps();

      _.each(this._childApps, _.bind(function (childApp, appName) {
        this.removeChildApp(appName);
      }, this));

      return childApps;
    },

    /**
     * Destroys or removes registered child `App` by name
     * depending on `preventDestroy`
     *
     * @public
     * @method removeChildApp
     * @param {String} appName - Name of App to destroy
     * @param {Object} [options.preventDestroy] - Flag to remove but prevent App destroy
     * @returns {App}
     */
    removeChildApp: function removeChildApp(appName, options) {
      options = _.extend({}, options);
      var childApp = this.getChildApp(appName);

      if (!childApp) {
        return;
      } // if preventDestroy simply unregister the child app


      if (options.preventDestroy || _.result(childApp, 'preventDestroy')) {
        this._removeChildApp(appName);
      } else {
        childApp.destroy();
      }

      return childApp;
    }
  };

  /**
   * This provides methods used for registering events while App is running and cleans them up at `onStop`. It's not meant to
   * be used directly.
   *
   * @mixin
   */

  var EventListenersMixin = {
    /**
     * Internal method to stop any registered events.
     *
     * @private
     * @method _stopRunningEvents
     */
    _stopRunningEvents: function _stopRunningEvents() {
      _.each(this._runningEvents, _.bind(function (args) {
        this.off.apply(this, args);
      }, this));

      this._runningEvents = [];
    },

    /**
     * Internal method to stop any registered listeners.
     *
     * @private
     * @method _stopRunningListeners
     */
    _stopRunningListeners: function _stopRunningListeners() {
      _.each(this._runningListeningTo, _.bind(function (args) {
        this.stopListening.apply(this, args);
      }, this));

      this._runningListeningTo = [];
    },

    /**
     * Overrides `Backbone.Event.on()`
     * If this `App` is running it will register the event for removal `onStop`
     *
     * @public
     * @method on
     * @returns {EventListeners}
     */
    on: function on() {
      if (this._isRunning) {
        this._runningEvents = this._runningEvents || [];

        this._runningEvents.push(arguments);
      }

      return backbone_marionette.MnObject.prototype.on.apply(this, arguments);
    },

    /**
     * Keep a copy of non-running on for internal use
     *
     * @private
     * @method _on
     * @returns {EventListeners}
     */
    _on: backbone_marionette.MnObject.prototype.on,

    /**
     * Overrides `Backbone.Event.listenTo()`
     * If this `App` is running it will register the listener for removal `onStop`
     *
     * @public
     * @method listenTo
     * @returns {EventListeners}
     */
    listenTo: function listenTo() {
      if (this._isRunning) {
        this._runningListeningTo = this._runningListeningTo || [];

        this._runningListeningTo.push(arguments);
      }

      return backbone_marionette.MnObject.prototype.listenTo.apply(this, arguments);
    },

    /**
     * Keep a copy of non-running on for internal use
     *
     * @private
     * @method _listenTo
     * @returns {EventListeners}
     */
    _listenTo: backbone_marionette.MnObject.prototype.listenTo,

    /**
     * Overrides `Backbone.Event.listenToOnce()`
     * If this `App` is running it will register the listener for removal `onStop`
     *
     * @public
     * @method listenToOnce
     * @returns {EventListeners}
     */
    listenToOnce: function listenToOnce() {
      if (this._isRunning) {
        this._runningListeningTo = this._runningListeningTo || [];

        this._runningListeningTo.push(arguments);
      }

      return backbone_marionette.MnObject.prototype.listenToOnce.apply(this, arguments);
    }
  };

  var ViewEventsMixin = {
    /**
     * Used as the prefix for events forwarded from
     * the component's view to the component
     * @type {String}
     * @default false
     */
    viewEventPrefix: false,

    /**
     * Constructs hashes and options for view event proxy
     *
     * @private
     * @method _buildEventProxies
     */
    _buildEventProxies: function _buildEventProxies() {
      var viewEvents = _.result(this, 'viewEvents') || {};
      this._viewEvents = this.normalizeMethods(viewEvents);
      this._viewTriggers = _.result(this, 'viewTriggers') || {};
      this._viewEventPrefix = _.result(this, 'viewEventPrefix');
    },

    /**
     * Proxies the ViewClass's viewEvents to the Component itself
     * Similar to CollectionView childEvents
     * (http://marionettejs.com/docs/v2.3.2/marionette.collectionview.html#collectionviews-childevents)
     *
     * @private
     * @method _proxyViewEvents
     * @param {Mn.View|Mn.CollectionView} view -
     * The instantiated ViewClass.
     */
    _proxyViewEvents: function _proxyViewEvents(view) {
      this.listenTo(view, 'all', this._childViewEventHandler);
    },

    /**
     * Event handler for view proxy
     * Similar to CollectionView childEvents
     * (http://marionettejs.com/docs/v2.3.2/marionette.collectionview.html#collectionviews-childevents)
     *
     * @private
     * @method _childViewEventHandler
     * @param {String} - event name
     */
    _childViewEventHandler: function _childViewEventHandler(eventName) {
      var viewEvents = this._viewEvents;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (_.isFunction(viewEvents[eventName])) {
        viewEvents[eventName].apply(this, args);
      } // use the parent view's proxyEvent handlers


      var viewTriggers = this._viewTriggers; // Call the event with the proxy name on the parent layout

      if (_.isString(viewTriggers[eventName])) {
        this.triggerMethod.apply(this, [viewTriggers[eventName]].concat(args));
      }

      var prefix = this._viewEventPrefix;

      if (prefix !== false) {
        var viewEventName = "".concat(prefix, ":").concat(eventName);
        this.triggerMethod.apply(this, [viewEventName].concat(args));
      }
    }
  };

  var ClassOptions$2 = ['startWithParent', 'restartWithParent', 'stopWithParent', 'startAfterInitialized', 'preventDestroy', 'StateModel', 'stateEvents', 'viewEventPrefix', 'viewEvents', 'viewTriggers'];
  /**
   * Marionette.Application with an `initialize` / `start` / `stop` / `destroy` lifecycle.
   *
   * @public
   * @class App
   * @memberOf Toolkit
   * @memberOf Marionette
   */

  var App = backbone_marionette.Application.extend({
    /**
     * Internal flag indiciate when `App` has started but has not yet stopped.
     *
     * @private
     * @type {Boolean}
     * @default false
     */
    _isRunning: false,

    /**
     * Internal flag indiciate when `App` is in the process of stopping then starting.
     *
     * @private
     * @type {Boolean}
     * @default false
     */
    _isRestarting: false,

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
     * Set this to determine if a parent `App` should maintain the child's
     * lifecycle during a restart.
     *
     * @type {Boolean|Function}
     * @default null
     */
    restartWithParent: null,

    /**
     * @public
     * @constructs App
     * @param {Object} [options] - Settings for the App.
     * @param {Boolean} [options.startWithParent]
     * @param {Boolean} [options.restartWithParent]
     * @param {Boolean} [options.stopWithParent]
     * @param {Boolean} [options.startAfterInitialized]
     * @param {Boolean} [options.preventDestroy]
     * @param {Object} [options.state] - Attributes to set on the state model.
     */
    constructor: function constructor() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.mergeOptions(options, ClassOptions$2);
      this.options = _.extend({}, _.result(this, 'options'), options); // ChildAppsMixin

      this._initChildApps(options);

      backbone_marionette.Application.call(this, options);

      if (_.result(this, 'startAfterInitialized')) {
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
    _ensureAppIsIntact: function _ensureAppIsIntact() {
      if (this._isDestroyed) {
        throw new Error('App has already been destroyed and cannot be used.');
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
    isRunning: function isRunning() {
      return this._isRunning;
    },

    /**
     * Gets the value of internal `_isRestarting` flag
     *
     * @public
     * @method isRestarting
     * @memberOf App
     * @returns {Boolean}
     */
    isRestarting: function isRestarting() {
      return this._isRestarting;
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
    start: function start() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this._ensureAppIsIntact();

      if (this._isRunning) {
        return this;
      }

      if (options.region) {
        this.setRegion(options.region);
      }

      if (options.view) {
        this.setView(options.view);
      } // StateMixin


      this._initState(options); // ViewEventMixin


      this._buildEventProxies();

      this.triggerMethod('before:start', options);
      this._isRunning = true;

      this._bindRunningEvents();

      this.triggerStart(options);
      return this;
    },

    /**
     * Sets up region, view, and state events.
     * To only be called after `isRunning` is true
     *
     * @private
     * @method _bindRunningEvents
     * @memberOf App
     */
    _bindRunningEvents: function _bindRunningEvents() {
      if (this._region) {
        this._regionEventMonitor();
      }

      if (this._view) {
        this._proxyViewEvents(this._view);
      } // StateMixin


      this.delegateStateEvents();
    },

    /**
     * Sets the app lifecycle to not running
     * then sets the app lifecycle to running with ending state
     *
     * @public
     * @method restart
     * @memberOf App
     * @returns {App}
     */
    restart: function restart(options) {
      var state = this.getState().attributes;
      this._isRestarting = true;
      this.stop().start(_.extend({
        state: state
      }, options));
      this._isRestarting = false;
      return this;
    },

    /**
     * Starts children and triggers start event
     * For calling within `triggerStart`
     *
     * @public
     * @method finallyStart
     * @memberOf App
     * @event App#start - passes any arguments
     * @returns
     */
    finallyStart: function finallyStart() {
      this._startChildApps();

      this.triggerMethod.apply(this, ['start'].concat(Array.prototype.slice.call(arguments)));
    },

    /**
     * Triggers start event via finallyStart.
     * Override to introduce async start
     *
     * @public
     * @method triggerStart
     * @memberOf App
     * @param {Object} [options] - Settings for the App passed through to events
     * @returns
     */
    triggerStart: function triggerStart(options) {
      this.finallyStart(options);
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
    stop: function stop(options) {
      if (!this._isRunning) {
        return this;
      }

      this.triggerMethod('before:stop', options);

      this._stopChildApps();

      this._isRunning = false;
      this.triggerMethod('stop', options); // Running events are cleaned up after stop so that
      // `stop` event handlers still fire

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
    destroy: function destroy() {
      if (this._isDestroyed) {
        return this;
      }

      this.stop();

      this._removeView();

      this._destroyChildApps();

      backbone_marionette.Application.prototype.destroy.apply(this, arguments);
      return this;
    },

    /**
     * Set the Application's Region
     *
     * @public
     * @method setRegion
     * @memberOf App
     * @param {Region} [region] - Region to use with the app
     * @returns {Region}
     */
    setRegion: function setRegion(region) {
      if (this._region) {
        this.stopListening(this._region);
      }

      this._region = region;

      if (region.currentView) {
        this.setView(region.currentView);
      }

      if (this._isRunning) {
        this._regionEventMonitor();
      }

      return region;
    },

    /**
     * Monitors the apps region before:show event so the region's view
     * is available to the app
     *
     * @private
     * @method _regionEventMonitor
     * @memberOf App
     */
    _regionEventMonitor: function _regionEventMonitor() {
      this.listenTo(this._region, {
        'before:show': this._onBeforeShow,
        'empty': this._onEmpty
      });
    },

    /**
     * Region monitor handler which sets the app's view to the region's view
     *
     * @private
     * @method _onBeforeShow
     * @memberOf App
     */
    _onBeforeShow: function _onBeforeShow(region, view) {
      this.setView(view);
    },

    /**
     * Region monitor handler which empties the region's view
     *
     * @private
     * @method _onEmpty
     * @memberOf App
     */
    _onEmpty: function _onEmpty(region, view) {
      if (view !== this._view) {
        return;
      }

      this._removeView();
    },

    /**
     * Region monitor handler which deletes the region's view and listeners to view
     *
     * @private
     * @method _removeView
     * @memberOf App
     */
    _removeView: function _removeView() {
      if (this._view) {
        this.stopListening(this._view);
        delete this._view;
      }
    },

    /**
     * Get the Application's Region or
     * Get a region from the Application's View
     *
     * @public
     * @method getRegion
     * @memberOf App
     * @param {String} [regionName] - Optional regionName to get from the view
     * @returns {Region}
     */
    getRegion: function getRegion(regionName) {
      if (!regionName) {
        return this._region;
      }

      return this.getView().getRegion(regionName);
    },

    /**
     * Set the Application's View
     *
     * @public
     * @method setView
     * @memberOf App
     * @param {View} [view] - View to use with the app
     * @returns {View}
     */
    setView: function setView(view) {
      if (this._view === view) {
        return view;
      }

      if (this._view) {
        this.stopListening(this._view);
      }

      this._view = view; // ViewEventsMixin

      if (this._isRunning) {
        this._proxyViewEvents(view);
      } // Internal non-running listener


      this._listenTo(this._view, 'destroy', this._removeView);

      return view;
    },

    /**
     * Get the Application's View
     *
     * @public
     * @method getView
     * @memberOf App
     * @returns {View}
     */
    getView: function getView() {
      return this._view || this._region && this._region.currentView;
    },

    /**
     * Shows a view in the Application's region
     *
     * @public
     * @method showView
     * @param {View} view - Child view instance defaults to App's view
     * @param {...args} Additional args that get passed along
     * @returns {View}
     */
    showView: function showView() {
      var view = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._view;
      var region = this.getRegion();

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      region.show.apply(region, [view].concat(args));

      if (!this.isRunning()) {
        this.setView(region.currentView);
      }

      return view;
    },

    /**
     * Shows a view in the region of the app's view
     *
     * @public
     * @method showChildView
     * @param {String} regionName - Name of region to show in
     * @param {View} view - Child view instance
     * @param {...args} Additional args that get passed along
     * @returns {View} - Child view instance
     */
    showChildView: function showChildView(regionName, view) {
      var _this$getView;

      for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      (_this$getView = this.getView()).showChildView.apply(_this$getView, [regionName, view].concat(args));

      return view;
    },

    /**
     * Returns view from the App view by region name.
     *
     * @public
     * @method getChildView
     * @param {String} regionName - Name of region to get view from
     * @returns {View}
     */
    getChildView: function getChildView(regionName) {
      return this.getView().getChildView(regionName);
    }
  });

  _.extend(App.prototype, StateMixin, ChildAppsMixin, EventListenersMixin, ViewEventsMixin);

  var ClassOptions$3 = ['regionOptions', 'ViewClass', 'viewEventPrefix', 'viewEvents', 'viewTriggers', 'viewOptions'];
  /**
   * Reusable Marionette.MnObject with View management boilerplate
   *
   * @public
   * @class Component
   * @memberOf Toolkit
   * @memberOf Marionette
   */

  var Component = backbone_marionette.Application.extend({
    /**
     * The view class to be managed.
     * @type {Mn.View|Mn.CollectionView}
     * @default Marionette.View
     */
    ViewClass: backbone_marionette.View,

    /**
     * @public
     * @constructs Component
     * @param {Object} [options] - Settings for the component.
     * @param {Object} [options.state] - Attributes to set on the state model.
     * @param {Mn.View|Mn.CollectionView} [options.ViewClass]
     * - The view class to be managed.
     * @param {String} [options.viewEventPrefix]
     * - Used as the prefix for events forwarded from the component's view to the component
     * @param {Object} [options.viewOptions] - Options hash passed to an instantiated ViewClass.
     * @param {Marionette.Region} [options.region] - The region to show the component in.
     */
    constructor: function constructor() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // Make defaults available to this
      this.mergeOptions(options, ClassOptions$3);
      this.options = _.extend({}, _.result(this, 'options'), options); // ViewEventMixin

      this._buildEventProxies(); // StateMixin


      this._initState(options);

      backbone_marionette.Application.call(this, options); // StateMixin

      this.delegateStateEvents();
    },

    /**
     * Set the Component's region and then show it.
     *
     * @public
     * @method showIn
     * @memberOf Component
     * @param {Marionette.Region} region - The region for the component
     * @param {Object} [viewOptions] - Options hash mixed into the instantiated ViewClass.
     * @param {Object} [regionOptions] - Options hash mixed into the instantiated region.
     * @returns {Component}
     */
    showIn: function showIn(region, viewOptions, regionOptions) {
      this._region = region;
      this.show(viewOptions, regionOptions);
      return this;
    },

    /**
     * Show the Component in its region.
     *
     * @public
     * @event Component#before:show
     * @event Component#show
     * @throws ComponentRegionError - Thrown if component has no defined region.
     * @method show
     * @param {Object} [viewOptions] - Options hash mixed into the instantiated ViewClass.
     * @param {Object} [regionOptions] - Options hash passed to the region on show.
     * @memberOf Component
     * @returns {Component}
     */
    show: function show(viewOptions, regionOptions) {
      var region = this.getRegion();

      if (!region) {
        throw new Error('Component has no defined region.');
      }

      var view = this._getView(viewOptions);

      this.stopListening(region.currentView, 'destroy', this.destroy);
      this.triggerMethod('before:show', this, view, viewOptions, regionOptions);
      this.showView(view, this.mixinRegionOptions(regionOptions));
      this.listenTo(region.currentView, 'destroy', this.destroy);
      this.triggerMethod('show', this, view, viewOptions, regionOptions);
      return this;
    },

    /**
     * Empty the Components region without destroying it
     *
     * @public
     * @throws ComponentRegionError - Thrown if component has no defined region.
     * @method empty
     * @memberOf Component
     * @returns {Component}
     */
    empty: function empty() {
      var region = this.getRegion();

      if (!region) {
        throw new Error('Component has no defined region.');
      }

      this.stopListening(region.currentView, 'destroy', this.destroy);
      region.empty();
      return this;
    },

    /**
     * Mixin regionOptions
     *
     * @public
     * @abstract
     * @method mixinRegionOptions
     * @memberOf Component
     * @param {Object} [options] - Additional options to mixin
     * @returns {Object}
     */
    mixinRegionOptions: function mixinRegionOptions(options) {
      var regionOptions = _.result(this, 'regionOptions');

      return _.extend({}, regionOptions, options);
    },

    /**
     * Get the Component view instance.
     *
     * @private
     * @method _getView
     * @memberOf Component
     * @param {Object} [options] - Options that can be used to determine the ViewClass.
     * @returns {View}
     */
    _getView: function _getView(options) {
      var ViewClass = this._getViewClass(options);

      var viewOptions = this.mixinViewOptions(options);
      var view = this.buildView(ViewClass, viewOptions); // ViewEventMixin

      this._proxyViewEvents(view);

      return view;
    },

    /**
     * Get the Component ViewClass class.
     * Checks if the `ViewClass` is a view class (the common case)
     * Then check if it's a function (which we assume that returns a view class)
     *
     * @private
     * @method _getViewClass
     * @memberOf Component
     * @param {Object} [options] - Options that can be used to determine the ViewClass.
     * @returns {View}
     */
    _getViewClass: function _getViewClass() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var ViewClass = this.ViewClass;

      if (ViewClass.prototype instanceof Backbone.View || ViewClass === Backbone.View) {
        return ViewClass;
      } else if (_.isFunction(ViewClass)) {
        return ViewClass.call(this, options);
      }

      throw new Error('"ViewClass" must be a view class or a function that returns a view class');
    },

    /**
     * Mixin initial State with any other viewOptions
     *
     * @public
     * @abstract
     * @method mixinViewOptions
     * @memberOf Component
     * @param {Object} [options] - Additional options to mixin
     * @returns {Object}
     */
    mixinViewOptions: function mixinViewOptions(options) {
      var viewOptions = _.result(this, 'viewOptions');

      return _.extend({
        state: this.getState().attributes
      }, viewOptions, options);
    },

    /**
     * Builds the view class with options
     * If you need a dynamic ViewClass override this function
     *
     * @public
     * @abstract
     * @method buildView
     * @memberOf Component
     * @param {Mn.View|Mn.CollectionView} ViewClass -
     * The view class to instantiate.
     * @param {Object} [viewOptions] - Options to pass to the View
     * @returns {Mn.View|Mn.CollectionView}
     */
    buildView: function buildView(ViewClass, viewOptions) {
      return new ViewClass(viewOptions);
    },

    /**
     * Empty the region and destroy the component.
     *
     * @public
     * @method destroy
     * @param {Object} [options] - Options passed to Mn.Application `destroy`
     * @memberOf Component
     */
    destroy: function destroy() {
      if (this._isDestroyed) {
        return this;
      }

      var region = this.getRegion();

      if (region) {
        region.empty();
      }

      backbone_marionette.Application.prototype.destroy.apply(this, arguments);
      return this;
    }
  }, {
    /**
     * Sets the region for a Component Class
     *
     * @public
     * @method setRegion
     * @param {Marionette.Region} - region definition for instantiated components
     * @memberOf Component.prototype
     */
    setRegion: function setRegion(region) {
      this.prototype.region = region;
    }
  });

  _.extend(Component.prototype, StateMixin, ViewEventsMixin);

  var version = "6.3.0";

  /**
   * @module Toolkit
   */

  function mixinState(classDefinition) {
    var _StateMixin = StateMixin;

    if (classDefinition.prototype.StateModel) {
      _StateMixin = _.omit(StateMixin, 'StateModel');
    }

    _.extend(classDefinition.prototype, _StateMixin);
  }

  exports.App = App;
  exports.Component = Component;
  exports.StateMixin = StateMixin;
  exports.VERSION = version;
  exports.mixinState = mixinState;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=marionette.toolkit.js.map
