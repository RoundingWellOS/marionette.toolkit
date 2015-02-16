(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require("backbone"), require("jquery"), require("backbone.marionette"), require("underscore")) : typeof define === "function" && define.amd ? define(["backbone", "jquery", "backbone.marionette", "underscore"], factory) : global.Toolkit = factory(global.Backbone, global.$, global.Marionette, global._);
})(this, function (Backbone, $, Marionette, _) {
  "use strict";

  var StateClass = Marionette.Object.extend({

    /**
     * The model class for _stateModel.
     * @type {Backbone.Model}
     */
    StateModel: Backbone.Model,

    /**
     * @public
     * @constructs StateClass
     * @param {Object} [options] - Settings for the stateClass.
     * @param {Object} [options.stateEvents] - Event hash bound from _stateModel to stateClass.
     * @param {Object} [options.StateModel] - Model class for _stateModel.
     */
    constructor: function (options) {
      options = options || {};

      // Get the StateModel from options or the class definition
      var StateModel = options.StateModel || this.StateModel;

      this._stateModel = new StateModel();

      // Bind events from the _stateModel defined in stateEvents hash
      this.bindEntityEvents(this._stateModel, this.getOption("stateEvents"));

      Marionette.Object.call(this, options);
    },

    /**
     * Set a property on the _stateModel.
     *
     * @public
     * @method setState
     * @memberOf StateClass
     * @param {String|Object} key - Attribute name or Hash of any number of key value pairs.
     * @param {*=} value - Attribute value if key is String, replaces options param otherwise.
     * @param {Object=} options - Backbone.Model options.
     * @returns {Backbone.Model} - The _stateModel
     */
    setState: function () {
      return this._stateModel.set.apply(this._stateModel, arguments);
    },

    /**
     * Get a property from the _stateModel, or return the _stateModel
     *
     * @public
     * @method getState
     * @memberOf StateClass
     * @param {String=} attr - Attribute name of stateModel.
     * @returns {Backbone.Model|*} - The _stateModel or the attribute value of the _stateModel
     */
    getState: function (attr) {
      if (!attr) {
        return this._stateModel;
      }

      return this._stateModel.get.apply(this._stateModel, arguments);
    },

    /**
     * Destroy the stateClass and clean up any listeners on the _stateModel.
     *
     * @public
     * @method destroy
     * @memberOf StateClass
     */
    destroy: function () {
      this._stateModel.stopListening();

      Marionette.Object.prototype.destroy.apply(this, arguments);
    }
  });

  var Subapp = StateClass.extend({

    constructor: function (options) {
      _.bindAll(this, "start", "stop");

      this._apps = {};

      _.extend(this, _.pick(options, ["startWithParent", "stopWithParent", "apps"]));

      this.addApps(this.getOption("apps"));

      this._initializeApps();

      StateClass.call(this, options);
    },

    _isRunning: false,

    _isDestroyed: false,

    startWithParent: false,

    stopWithParent: true,

    _ensureSubappIsIntact: function () {
      if (this._isDestroyed) {
        throw new Marionette.Error({
          name: "SubappDestroyedError",
          message: "Subapp has already been destroyed and cannot be used."
        });
      }
    },

    start: function (options) {
      this._ensureSubappIsIntact();

      if (this._isRunning) {
        return;
      }

      this.triggerMethod("before:start", options);

      this._isRunning = true;
      this.startApps();

      this.triggerMethod("start", options);
    },

    stop: function (options) {
      if (!this._isRunning) {
        return;
      }

      this.triggerMethod("before:stop", options);

      this._isRunning = false;
      this.stopApps();

      this.triggerMethod("stop", options);
    },

    addApp: function (appName, Definition, options) {
      var app = this._apps[appName] = new Definition(options);

      if (this._isRunning && app.getOption("startWithParent")) {
        app.start();
      }

      return app;
    },

    getApp: function (appName) {
      return this._apps[appName];
    },

    destroyApp: function (app) {
      // if app is a string assume it's an app's name
      if (_.isString(app)) {
        app = this.getApp(app);
      }

      if (app) {
        app.destroy();
      }
    },

    addApps: function (apps) {
      _.each(apps, function (app, appName) {
        this.addApp(appName, app);
      });
    },

    _initializeApps: function () {},

    startApps: function () {},

    stopApps: function () {
      _.each(this._apps, this.stopApp);
    },

    isRunning: function () {
      return this._isRunning;
    },

    isDestroyed: function () {
      return this._isDestroyed;
    },

    destroy: function () {
      this.stop();

      this.destroyApps();

      this._isDestroyed = true;

      StateClass.prototype.destroy.apply(this, arguments);
    }

  });

  var Component = StateClass.extend({
    constructor: function (stateAttrs, options) {
      options = options || {};
      // Make defaults available to this
      _.extend(this, _.pick(options, ["viewEventPrefix", "viewClass", "viewOptions", "region"]));

      Marionette.StateObject.call(this, options);

      this._setStateDefaults(stateAttrs);
    },

    _shouldDestroy: true,

    _setStateDefaults: function (stateAttrs) {
      _.defaults(stateAttrs, _.result(this, "defaults"));

      this.setState(stateAttrs, { silent: true });
    },

    viewEventPrefix: "view",

    viewClass: Marionette.ItemView,

    viewOptions: {},

    showIn: function (region) {
      if (region) {
        this.region = region;
      }

      this.show();
    },

    show: function () {
      if (this._isShown) {
        throw new Marionette.Error({
          name: "ComponentShowError",
          message: "Component has already been shown in a region."
        });
      }

      if (!this.region) {
        throw new Marionette.Error({
          name: "ComponentRegionError",
          message: "Component has no defined region."
        });
      }

      // Destroy the component if the region is emptied because
      // it destroys the view
      this.listenTo(this.region, "empty", this.destroy);

      this.triggerMethod("before:show");

      this.renderView();
      this._isShown = true;

      this.triggerMethod("show");
    },

    renderView: function () {
      this.view = this.buildView();

      this._proxyViewEvents();

      this.triggerMethod("before:render:view", this.view);

      // _shouldDestroy is flag that prevents the Component from being
      // destroyed if the region is emptied by Component itself.
      this._shouldDestroy = false;

      // Show the view in the region
      this.region.show(this.view);

      this._shouldDestroy = true;

      this.triggerMethod("render:view", this.view);
    },

    _proxyViewEvents: function () {
      // Proxies the viewClass's viewEvents to the Component itself
      // similar to CollectionView childEvents
      // (http://marionettejs.com/docs/v2.3.2/marionette.collectionview.html#collectionviews-childevents)

      var prefix = this.getOption("viewEventPrefix");

      this.view.on("all", function () {
        var args = _.toArray(arguments);
        var rootEvent = args[0];

        args[0] = prefix + ":" + rootEvent;
        args.splice(1, 0, this.view);

        this.triggerMethod.apply(this, args);
      }, this);
    },

    // mixin _state_model from StateObject with any other viewOptions
    mixinOptions: function (options) {
      return _.extend({ model: this.getState() }, this.viewOptions, options);
    },

    buildView: function () {
      return new this.viewClass(this.mixinOptions());
    },

    _destroy: function () {
      // apply destroy first for listener cleanup
      Marionette.StateObject.prototype.destroy.apply(this, arguments);

      this.region.empty();
    },

    destroy: function () {
      if (this._shouldDestroy) {
        this._destroy();
      }

      return this;
    }
  });

  Backbone.$ = $;
  var Toolkit = Marionette.Toolkit = {};

  Toolkit.StateClass = StateClass;

  Toolkit.Subapp = Subapp;

  Toolkit.Component = Component;

  var backbone_toolkit = Toolkit;

  return backbone_toolkit;
});
//# sourceMappingURL=./backbone.toolkit.js.map
//on subapp destroy delete from _apps