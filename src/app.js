import _ from 'underscore';
import Marionette from 'backbone.marionette';
import AbstractApp from './abstract-app';

/**
 * AbstractApp with an "App Manager" functionality mixed in for adding and removing child `App`s.
 *
 * @public
 * @class App
 * @memberOf Toolkit
 * @memberOf Marionette
 */
var App = AbstractApp.extend({

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
  constructor: function(options) {
    options = options || {};

    this._childApps = {};

    _.extend(this, _.pick(options, ['childApps']));

    this._initChildApps();

    // The child apps should be handled while the app is running;
    // After start, before stop, and before destroy.
    this.on({
      'start'          : this._startChildApps,
      'before:stop'    : this._stopChildApps,
      'before:destroy' : this._destroyChildApps
    });

    AbstractApp.call(this, options);
  },

  /**
   * Initializes `childApps` option
   *
   * @private
   * @method _initChildApps
   * @memberOf App
   */
  _initChildApps: function() {
    if(this.childApps) {
      this.addChildApps(_.result(this, 'childApps'));
    }
  },

  /**
   * Starts `childApps` if allowed by child
   *
   * @private
   * @method _startChildApps
   * @memberOf App
   */
  _startChildApps: function() {
    _.each(this._childApps, function(childApp) {
      if(_.result(childApp, 'startWithParent')) {
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
  _stopChildApps: function() {
    _.each(this._childApps, function(childApp) {
      if(_.result(childApp, 'stopWithParent')) {
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
  _destroyChildApps: function() {
    _.each(this._childApps, function(childApp) {
      if(!_.result(childApp, 'preventDestroy')) {
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
  _buildAppFromObject: function(appConfig) {
    var AppClass = appConfig.AppClass;
    var options = _.omit(appConfig, 'AppClass');

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
  _buildApp: function(AppClass, options) {
    if(_.isFunction(AppClass)) {
      return this.buildApp(AppClass, options);
    }
    if(_.isObject(AppClass)) {
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
  buildApp: function(AppClass, options) {
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
  _ensureAppIsUnique: function(appName) {
    if(this._childApps[appName]) {
      throw new Marionette.Error({
        name: 'DuplicateChildAppError',
        message: 'A child App with name "' + appName + '" has already been added.'
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
  addChildApps: function(childApps) {
    _.each(childApps, function(childApp, appName) {
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
  addChildApp: function(appName, AppClass, options) {
    this._ensureAppIsUnique(appName);

    var childApp = this._buildApp(AppClass, options);

    if(!childApp){
      throw new Marionette.Error({
        name: 'AddChildAppError',
        message: 'App build failed.  Incorrect configuration.'
      });
    }

    this._childApps[appName] = childApp;

    // When the app is destroyed remove the cached app.
    childApp.on('destroy', _.partial(this._removeChildApp, appName), this);

    if(this.isRunning() && _.result(childApp, 'startWithParent')) {
      childApp.start(options);
    }

    return childApp;
  },

  /**
   * Returns registered child `App`s array
   *
   * @public
   * @method getChildApps
   * @memberOf App
   * @returns {Array}
   */
  getChildApps: function(){
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
  getChildApp: function(appName) {
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
  _removeChildApp: function(appName) {
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
  removeChildApps: function(){
    var childApps = this.getChildApps();

    _.each(this._childApps, function(childApp, appName) {
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
  removeChildApp: function(appName, options) {
    options = options || {};

    var childApp = this.getChildApp(appName);

    if(!childApp) {
      return;
    }

    // if preventDestroy simply unregister the child app
    if(options.preventDestroy || _.result(childApp, 'preventDestroy')) {
      this._removeChildApp(appName);
    } else {
      childApp.destroy();
    }

    return childApp;
  }

});

export default App;
