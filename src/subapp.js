import _ from 'underscore';
import Marionette from 'backbone.marionette';
import StateClass from './state-class';

var Subapp = StateClass.extend({

  constructor: function(options) {
    _.bindAll(this, 'start', 'stop');

    this._apps = {};

    _.extend(this, _.pick(options, ['startWithParent', 'stopWithParent', 'apps']));

    this.addApps(this.getOption('apps'));

    this._initializeApps();

    StateClass.call(this, options);
  },

  _isRunning: false,

  _isDestroyed: false,

  startWithParent: false,

  stopWithParent: true,

  _ensureSubappIsIntact: function(){
    if(this._isDestroyed) {
      throw new Marionette.Error({
        name: 'SubappDestroyedError',
        message: 'Subapp has already been destroyed and cannot be used.'
      });
    }
  },

  start: function(options) {
    this._ensureSubappIsIntact();

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
  },

  addApp: function(appName, Definition, options) {
    var app = this._apps[appName] = new Definition(options);

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
    if(_.isString(app)){
      app = this.getApp(app);
    }

    if(app) {
      app.destroy();
    }
  },

  addApps: function(apps) {
    _.each(apps, function(app, appName){
      this.addApp(appName, app);
    });
  },

  _initializeApps: function() {
    //on subapp destroy delete from _apps
  },

  startApps: function() {

  },

  stopApps: function() {
    _.each(this._apps, this.stopApp);
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
  }

});

export default Subapp;
