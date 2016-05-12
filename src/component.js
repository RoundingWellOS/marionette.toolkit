import _ from 'underscore';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import StateMixin from './mixins/state';

/**
 * Reusable StateClass with View management boilerplate
 *
 * @public
 * @class Component
 * @memberOf Toolkit
 * @memberOf Marionette
 */
const Component = Marionette.Object.extend({

  /**
   * The view class to be managed.
   * @type {Mn.ItemView|Mn.CollectionView|Mn.CompositeView|Mn.LayoutView}
   * @default Marionette.ItemView
   */
  ViewClass: Marionette.ItemView,

  /**
   * Used as the prefix for events forwarded from
   * the component's view to the component
   * @type {String}
   * @default 'view'
   */
  viewEventPrefix: 'view',

  /**
   * Options hash passed to the view when built.
   * @type {Object|Function}
   * @default '{}'
   */
  viewOptions: {},

  /**
   * @public
   * @constructs Component
   * @param {Object} [stateAttrs] - Attributes to set on the state model.
   * @param {Object} [options] - Settings for the component.
   * @param {Mn.ItemView|Mn.CollectionView|Mn.CompositeView|Mn.LayoutView=} [options.ViewClass]
   * - The view class to be managed.
   * @param {String} [options.viewEventPrefix]
   * - Used as the prefix for events forwarded from the component's view to the component
   * @param {Object} [options.viewOptions] - Options hash passed to an instantiated ViewClass.
   * @param {Marionette.Region} [options.region] - The region to show the component in.
   */
  constructor: function(stateAttrs, options) {
    options = _.extend({}, options);

    // Make defaults available to this
    _.extend(this, _.pick(options, ['viewEventPrefix', 'ViewClass', 'viewOptions', 'region']));

    this.initState(options);

    this._setStateDefaults(stateAttrs);
  },

  /**
   * Internal flag to determine if the component should destroy.
   * Set to false while showing the component's view in the component's region.
   *
   * @private
   * @type {Boolean}
   * @default true
   */
  _shouldDestroy: true,

  /**
   * Set the state model attributes to the initial
   * passed in attributes or any defaults set
   *
   * @private
   * @method _setStateDefaults
   * @memberOf Component
   * @param {Object} [stateAttrs] - Attributes to set on the state model
   */
  _setStateDefaults: function(stateAttrs) {
    this.setState(stateAttrs, { silent: true });
  },

  /**
   * Set the Component's region and then show it.
   *
   * @public
   * @method showIn
   * @memberOf Component
   * @param {Marionette.Region} region - The region for the component
   * @param {Object} [viewOptions] - Options hash mixed into the instantiated ViewClass.
   * @returns {Component}
   */
  showIn: function(region, viewOptions) {
    this.region = region;

    this.show(viewOptions);

    return this;
  },

  /**
   * Show the Component in its region.
   *
   * @public
   * @event Component#before:show
   * @event Component#show
   * @throws ComponentShowError - Thrown if component has already been show.
   * @throws ComponentRegionError - Thrown if component has no defined region.
   * @method show
   * @param {Object} [viewOptions] - Options hash mixed into the instantiated ViewClass.
   * @memberOf Component
   * @returns {Component}
   */
  show: function(viewOptions) {
    if(this._isShown) {
      throw new Marionette.Error({
        name: 'ComponentShowError',
        message: 'Component has already been shown in a region.'
      });
    }

    if(!this.region) {
      throw new Marionette.Error({
        name: 'ComponentRegionError',
        message: 'Component has no defined region.'
      });
    }

    this.triggerMethod('before:show');

    this.renderView(viewOptions);
    this._isShown = true;

    this.triggerMethod('show');

    // Destroy the component if the region is emptied because
    // it destroys the view
    this.listenTo(this.region, 'empty', this._destroy);

    return this;
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
  _getViewClass: function(options) {
    options = _.extend({}, options);

    const ViewClass = this.getOption('ViewClass');

    if(ViewClass.prototype instanceof Backbone.View || ViewClass === Backbone.View) {
      return ViewClass;
    } else if(_.isFunction(ViewClass)) {
      return ViewClass.call(this, options);
    }

    throw new Marionette.Error({
      name: 'InvalidViewClassError',
      message: '"ViewClass" must be a view class or a function that returns a view class'
    });
  },

  /**
   * Shows or re-shows a newly built view in the component's region
   *
   * @public
   * @event Component#before:render:view
   * @event Component#render:view
   * @method renderView
   * @memberOf Component
   * @param {Object} [options] - Options hash mixed into the instantiated ViewClass.
   * @returns {Component}
   */
  renderView: function(options) {
    const ViewClass = this._getViewClass(options);

    const viewOptions = this.mixinOptions(options);

    const view = this.buildView(ViewClass, viewOptions);

    // Attach current built view to component
    this.currentView = view;

    this._proxyViewEvents(view);

    this.triggerMethod('before:render:view', view);

    // _shouldDestroy is flag that prevents the Component from being
    // destroyed if the region is emptied by Component itself.
    this._shouldDestroy = false;

    // Show the view in the region
    this.region.show(view);

    this._shouldDestroy = true;

    this.triggerMethod('render:view', view);

    return this;
  },

  /**
   * Proxies the ViewClass's viewEvents to the Component itself
   * Similar to CollectionView childEvents
   * (http://marionettejs.com/docs/v2.3.2/marionette.collectionview.html#collectionviews-childevents)
   *
   * @private
   * @method _proxyViewEvents
   * @memberOf Component
   * @param {Mn.ItemView|Mn.CollectionView|Mn.CompositeView|Mn.LayoutView} view -
   * The instantiated ViewClass.
   */
  _proxyViewEvents: function(view) {
    const prefix = this.getOption('viewEventPrefix');

    view.on('all', function() {
      const args = _.toArray(arguments);
      const rootEvent = args[0];

      args[0] = `${ prefix }:${ rootEvent }`;
      args.splice(1, 0, view);

      this.triggerMethod.apply(this, args);
    }, this);
  },

  /**
   * Mixin stateModel from StateClass with any other viewOptions
   *
   * @public
   * @abstract
   * @method mixinOptions
   * @memberOf Component
   * @param {Object} [options] - Additional options to mixin
   * @returns {Object}
   */
  mixinOptions: function(options) {
    const viewOptions = _.result(this, 'viewOptions');

    return _.extend({ stateModel: this.getState() }, viewOptions, options);
  },

  /**
   * Builds the view class with options
   * If you need a dynamic ViewClass override this function
   *
   * @public
   * @abstract
   * @method buildView
   * @memberOf Component
   * @param {Mn.ItemView|Mn.CollectionView|Mn.CompositeView|Mn.LayoutView} ViewClass -
   * The view class to instantiate.
   * @param {Object} [viewOptions] - Options to pass to the View
   * @returns {Mn.ItemView|Mn.CollectionView|Mn.CompositeView|Mn.LayoutView}
   */
  buildView: function(ViewClass, viewOptions) {
    return new ViewClass(viewOptions);
  },

  /**
   * Destroys Component.
   *
   * @private
   * @method _destroy
   * @memberOf Component
   */
  _destroy: function() {
    if(this._shouldDestroy) {
      Marionette.Object.prototype.destroy.apply(this, arguments);
    }
  },

  /**
   * Empties component's region.
   *
   * @private
   * @method _emptyRegion
   * @param {Object} [options] - Options passed to `region.empty`
   * @memberOf Component
   */
  _emptyRegion: function(options) {
    if(this.region) {
      this.stopListening(this.region, 'empty');
      this.region.empty(options);
    }
  },

  /**
   * Empty the region and destroy the component.
   *
   * @public
   * @method destroy
   * @param {Object} [options] - Options passed to `_emptyRegion` and `destroy`
   * @memberOf Component
   */
  destroy: function(options) {
    this._emptyRegion(options);

    this._shouldDestroy = true;

    this.destroyState();

    this._destroy(options);
  }
});

_.extend(Component.prototype, StateMixin);

export default Component;
