import _ from 'underscore';
import Marionette from 'backbone.marionette';
import StateClass from './state-class';

var App = StateClass.extend({

  constructor: function(options) {
    options = options || {};

    _.bindAll(this, 'start', 'stop');

    this._childApps = {};

    var pickOptions = [
      'startWithParent',
      'stopWithParent',
      'startAfterInitialized',
      'childApps'
    ];

    _.extend(this, _.pick(options, pickOptions));

    // Initialize apps
    if(this.childApps) {
      this.addChildApps(_.result(this, 'childApps'));
    }

    // Will call initialize
    StateClass.call(this, options);

    if(_.result(this, 'startAfterInitialized')) {
      this.start();
    }
  },

  _isRunning: false,

  _isDestroyed: false,

  startAfterInitialized: false,

  startWithParent: false,

  stopWithParent: true,

  _ensureAppIsIntact: function() {
    if(this._isDestroyed) {
      throw new Marionette.Error({
        name: 'AppDestroyedError',
        message: 'App has already been destroyed and cannot be used.'
      });
    }
  },

  isRunning: function() {
    return this._isRunning;
  },

  start: function(options) {
    this._ensureAppIsIntact();

    if(this._isRunning) {
      return;
    }

    this.triggerMethod('before:start', options);

    this._isRunning = true;
    this.startChildApps();

    this.triggerMethod('start', options);

    return this;
  },

  stop: function(options) {
    if(!this._isRunning) {
      return;
    }

    this.triggerMethod('before:stop', options);

    this._isRunning = false;
    this.stopChildApps();

    this.triggerMethod('stop', options);

    this._stopRunningListeners();
    this._stopRunningEvents();

    return this;
  },


  _buildAppFromObject: function(appConfig) {
    var AppClass = appConfig.AppClass;
    var options = _.omit(appConfig, 'AppClass');

    return new AppClass(options);
  },

  buildChildApp: function(AppClass, options) {
    if(_.isObject(AppClass)) {
      return this._buildAppFromObject(AppClass);
    }

    if(_.isFunction(AppClass)) {
      return new AppClass(options);
    }
  },

  addChildApp: function(appName, AppClass, options) {
    var childApp = this.buildChildApp(AppClass, options);

    if(!childApp){
      throw new Marionette.Error({
        name: 'AddChildAppError',
        message: 'App build failed.  Incorrect configuration.'
      });
    }

    this._childApps[appName] = childApp;

    // When the app is destroyed remove the cached app.
    childApp.on('destroy', function() {
      delete this._childApps[appName];
    }, this);

    if(this._isRunning && _.result(childApp, 'startWithParent')) {
      childApp.start();
    }

    return childApp;
  },

  getChildApp: function(appName) {
    return this._childApps[appName];
  },

  removeChildApp: function(childApp) {

    // if app is a string assume it's an app's name
    if(_.isString(childApp)) {
      childApp = this.getChildApp(childApp);
    }

    if(childApp) {
      childApp.destroy();
    }
  },

  addChildApps: function(childApps) {
    _.each(childApps, function(childApp, appName) {
      this.addChildApp(appName, childApp);
    }, this);
  },

  startChildApps: function() {
    _.each(this._childApps, function(childApp) {
      if(_.result(childApp, 'startWithParent')) {
        childApp.start();
      }
    });
  },

  stopChildApps: function() {
    _.each(this._childApps, function(childApp) {
      if(_.result(childApp, 'stopWithParent')) {
        childApp.stop();
      }
    });
  },

  destroyChildApps: function() {
    _.each(this._childApps, function(childApp) {
      childApp.destroy();
    });
  },

  isDestroyed: function() {
    return this._isDestroyed;
  },

  destroy: function() {
    this.stop();

    this.destroyChildApps();

    this._isDestroyed = true;

    StateClass.prototype.destroy.apply(this, arguments);
  },

  _stopRunningEvents: function(){
    _.each(this._runningEvents, function(args) {
      this.off.apply(this, args);
    }, this);
  },

  _stopRunningListeners: function(){
    _.each(this._runningListeningTo, function(args) {
      this.stopListening.apply(this, args);
    }, this);
  },

  on: function() {
    if(this._isRunning) {
      this._runningEvents = (this._runningEvents || []);
      this._runningEvents.push(arguments);
    }
    return StateClass.prototype.on.apply(this, arguments);
  },

  listenTo: function() {
    if(this._isRunning) {
      this._runningListeningTo = (this._runningListeningTo || []);
      this._runningListeningTo.push(arguments);
    }
    return StateClass.prototype.listenTo.apply(this, arguments);
  }

});

export default App;
