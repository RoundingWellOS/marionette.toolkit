import _ from 'underscore';

const ClassOptions = [
  'childApps',
  'childAppOptions'
];

 /**
 * This provides methods used for "App Manager" functionality - the adding and removing child `App`s. It's not meant to
 * be used directly.
 *
 * @mixin
 */
export default {

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
  _initChildApps(options = {}) {
    this._childApps = {};

    this.mergeOptions(options, ClassOptions);

    let childApps = this.childApps;

    if(childApps) {
      if(_.isFunction(childApps)) {
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
  _getChildStartOpts(childApp) {
    const tkOpts = childApp._tkOpts || {};

    const opts = {
      region: this.getRegion(tkOpts.regionName)
    };

    _.each(tkOpts.getOptions, opt => {
      opts[opt] = this.getOption(opt);
    });

    return opts;
  },

  /**
   * Starts a `childApp`
   *
   * @private
   * @method _startChildApp
   */
  _startChildApp(childApp, options) {
    const opts = this._getChildStartOpts(childApp);
    return childApp.start(_.extend(opts, options));
  },

  /**
   * Handles explicit boolean values of restartWithParent
   * restartWithParent === false does nothing
   *
   * @private
   * @method _shouldStartWithRestart
   */
  _shouldActWithRestart(childApp, action) {
    if(!this._isRestarting) return true;
    const restartWithParent = _.result(childApp, 'restartWithParent');
    if(restartWithParent === true) return true;
    if(restartWithParent !== false && _.result(childApp, action)) return true;
  },

  /**
   * Starts `childApps` if allowed by child
   *
   * @private
   * @method _startChildApps
   */
  _startChildApps() {
    const action = 'startWithParent';
    _.each(this._childApps, childApp => {
      if(!this._shouldActWithRestart(childApp, action)) return;
      if(!this._isRestarting && !_.result(childApp, action)) return;
      this._startChildApp(childApp);
    });
  },

  /**
   * Stops `childApps` if allowed by child
   *
   * @private
   * @method _stopChildApps
   */
  _stopChildApps() {
    const action = 'stopWithParent';
    _.each(this._childApps, childApp => {
      if(!this._shouldActWithRestart(childApp, action)) return;
      if(!this._isRestarting && !_.result(childApp, action)) return;
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
  startChildApp(appName, options) {
    const childApp = this.getChildApp(appName);
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
  stopChildApp(appName, options) {
    return this.getChildApp(appName).stop(options);
  },

  /**
   * Destroys `childApps` if allowed by child
   *
   * @private
   * @method _destroyChildApps
   */
  _destroyChildApps() {
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
   * @param {Object} appConfig - `AppClass` and any other option for the `App`
   * @returns {App}
   */
  _buildAppFromObject(appConfig) {
    const AppClass = appConfig.AppClass;
    const options = _.omit(appConfig, 'AppClass', 'regionName', 'getOptions');

    const app = this.buildApp(AppClass, options);

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
  _buildApp(AppClass, options) {
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
   * @param {App} [AppClass] - An App Class
   * @param {Object} [options] - options for the AppClass
   * @returns {App}
   */
  buildApp(AppClass, options) {
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
  _ensureAppIsUnique(appName) {
    if(this._childApps[appName]) {
      throw new Error(`A child App with name "${ appName }" has already been added.`);
    }
  },

  /**
   * Add child `App`s to this `App`
   *
   * @public
   * @method addChildApps
   * @param {Object} childApps - Hash of names and `AppClass` or `appConfig`
   */
  addChildApps(childApps) {
    _.each(childApps, _.bind(function(childApp, appName) {
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
  addChildApp(appName, AppClass, options) {
    this._ensureAppIsUnique(appName);

    const childApp = this._buildApp(AppClass, options);

    if(!childApp) {
      throw new Error('App build failed.  Incorrect configuration.');
    }

    childApp._name = appName;

    this._childApps[appName] = childApp;

    // When the app is destroyed remove the cached app.
    // Listener setup relative to the childApp's running state (using _on)
    childApp._on('destroy', _.partial(this._removeChildApp, appName), this);

    if(this.isRunning() && _.result(childApp, 'startWithParent')) {
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
  getName() {
    return this._name;
  },


  /**
   * Returns registered child `App`s array
   *
   * @public
   * @method getChildApps
   * @returns {Array}
   */
  getChildApps() {
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
  getChildApp(appName) {
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
  _removeChildApp(appName) {
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
  removeChildApps() {
    const childApps = this.getChildApps();

    _.each(this._childApps, _.bind(function(childApp, appName) {
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
  removeChildApp(appName, options) {
    options = _.extend({}, options);

    const childApp = this.getChildApp(appName);

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
};
