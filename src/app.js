import _ from 'underscore';
import Marionette from 'backbone.marionette';
import StateClass from './state-class';

var App = StateClass.extend({

  constructor: function(options) {
    options = options || {};

    _.bindAll(this, 'start', 'stop');

    this._apps = {};

    _.extend(this, _.pick(options, ['startWithParent', 'stopWithParent', 'apps']));

    // Initialize apps
    this.addApps(this.getOption('apps'));

    StateClass.call(this, options);
  },

  _isRunning: false,

  _isDestroyed: false,

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

  start: function(options) {
    this._ensureAppIsIntact();

    if(this._isRunning) {
      return;
    }

    this.triggerMethod('before:start', options);

    this._isRunning = true;
    this.startApps();

    this.triggerMethod('start', options);
  },

  stop: function(options) {
    if(!this._isRunning) {
      return;
    }

    this.triggerMethod('before:stop', options);

    this._isRunning = false;
    this.stopApps();

    this.triggerMethod('stop', options);

    this._stopRunningListeners();
    this._stopRunningEvents();

  },

  addApp: function(appName, AppDefinition, options) {
    var app = this._apps[appName] = new AppDefinition(options);

    // When the app is destroyed remove the cached app.
    app.on('destroy', function() {
      delete this._apps[appName];
    }, this);

    if(this._isRunning && app.getOption('startWithParent')) {
      app.start();
    }

    return app;
  },

  getApp: function(appName) {
    return this._apps[appName];
  },

  destroyApp: function(app) {

    // if app is a string assume it's an app's name
    if(_.isString(app)) {
      app = this.getApp(app);
    }

    if(app) {
      app.destroy();
    }
  },

  addApps: function(apps) {
    _.each(apps, function(app, appName) {
      this.addApp(appName, app);
    });
  },

  startApps: function() {
    _.each(this._apps, function(app) {
      if(app.getOption('startWithParent')) {
        app.start();
      }
    });
  },

  stopApps: function() {
    _.each(this._apps, function(app) {
      if(app.getOption('stopWithParent')) {
        app.stop();
      }
    });
  },

  isRunning: function() {
    return this._isRunning;
  },

  isDestroyed: function() {
    return this._isDestroyed;
  },

  destroy: function() {
    this.stop();

    this.destroyApps();

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
