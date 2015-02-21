import _ from 'underscore';
import Marionette from 'backbone.marionette';
import StateClass from './state-class';

var App = StateClass.extend({

  constructor: function(options) {
    options = options || {};

    _.bindAll(this, 'start', 'stop');

    this._childApps = {};

    _.extend(this, _.pick(options, ['startWithParent', 'stopWithParent', 'childApps']));

    var childApps = Marionette._getValue(this.childApps);

    // Initialize apps
    this.addChildApps(childApps);

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
    this.startChildApps();

    this.triggerMethod('start', options);
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

  },


  addChildApp: function(appName, AppDefinition, options) {
    var childApp = this._childApps[appName] = new AppDefinition(options);

    // When the app is destroyed remove the cached app.
    childApp.on('destroy', function() {
      delete this._childApps[appName];
    }, this);

    if(this._isRunning && childApp.startWithParent) {
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
      if(childApp.startWithParent) {
        childApp.start();
      }
    });
  },

  stopChildApps: function() {
    _.each(this._childApps, function(childApp) {
      if(childApp.stopWithParent) {
        childApp.stop();
      }
    });
  },

  destroyChildApps: function() {
    _.each(this._childApps, function(childApp) {
      childApp.destroy();
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
