import _ from 'underscore';
import Marionette from 'backbone.marionette';
import StateClass from './state-class';

/**
 * Reusable StateClass with View management boilerplate
 *
 * @public
 * @class StateClass
 * @memberOf Toolkit
 * @memberOf Marionette
 */
var Component = StateClass.extend({

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
   * @param {Mn.ItemView|Mn.CollectionView|Mn.CompositeView|Mn.LayoutView} [options.ViewClass]
   * - The view class to be managed.
   * @param {String} [options.viewEventPrefix]
   * - Used as the prefix for events forwarded from the component's view to the component
   * @param {Object} [options.viewOptions] - The view class to be managed.
   * @param {Marionette.Region=} [options.region] - The region to show the component in.
   */
  constructor: function(stateAttrs, options){
    options = options || {};

    // Make defaults available to this
    _.extend(this, _.pick(options, ['viewEventPrefix', 'ViewClass', 'viewOptions', 'region']));

    StateClass.call(this, options);

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
   * @param {Object=} stateAttrs - Attributes to set on the state model
   */
  _setStateDefaults: function(stateAttrs){
    _.defaults(stateAttrs, _.result(this, 'defaults'));

    this.setState(stateAttrs, { silent: true });
  },

  /**
   * Set the Component's region and then show it.
   *
   * @public
   * @method showIn
   * @memberOf Component
   * @param {Marionette.Region} region - The region for the component
   * @returns {Component}
   */
  showIn: function(region) {
    if(region) {
        this.region = region;
    }

    this.show();

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
   * @memberOf Component
   * @returns {Component}
   */
  show: function(){
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

    // Destroy the component if the region is emptied because
    // it destroys the view
    this.listenTo(this.region, 'empty', this.destroy);

    this.triggerMethod('before:show');

    this.renderView();
    this._isShown = true;

    this.triggerMethod('show');

    return this;
  },

  /**
   * Shows or re-shows a newly built view in the component's region
   *
   * @public
   * @event Component#before:render:view
   * @event Component#render:view
   * @method renderView
   * @memberOf Component
   * @returns {Component}
   */
  renderView: function(){
    this.view = this.buildView();

    this._proxyViewEvents();

    this.triggerMethod('before:render:view', this.view);

    // _shouldDestroy is flag that prevents the Component from being
    // destroyed if the region is emptied by Component itself.
    this._shouldDestroy = false;

    // Show the view in the region
    this.region.show(this.view);

    this._shouldDestroy = true;

    this.triggerMethod('render:view', this.view);

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
   */
  _proxyViewEvents: function(){
    var prefix = this.getOption('viewEventPrefix');

    this.view.on('all', function() {
      var args = _.toArray(arguments);
      var rootEvent = args[0];

      args[0] = prefix + ':' + rootEvent;
      args.splice(1, 0, this.view);

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
   * @param {Object=} options - Additional options to mixin
   * @returns {Object}
   */
  mixinOptions: function(options){
    var viewOptions = _.result(this, 'viewOptions');

    return _.extend({ model: this.getState() }, viewOptions, options);
  },

  /**
   * Get the component ViewClass.
   * If you need a dynamic ViewClass override this function
   *
   * @public
   * @abstract
   * @method getViewClass
   * @memberOf Component
   * @returns {Mn.ItemView|Mn.CollectionView|Mn.CompositeView|Mn.LayoutView}
   */
  getViewClass: function(){
    return this.ViewClass;
  },

  /**
   * Builds the view class with mixed in options
   *
   * @public
   * @abstract
   * @method buildView
   * @memberOf Component
   * @returns {Mn.ItemView|Mn.CollectionView|Mn.CompositeView|Mn.LayoutView}
   */
  buildView: function() {
    var ViewClass = this.getViewClass();

    return new ViewClass(this.mixinOptions());
  },

  /**
   * Destroys Component and empties its region.
   *
   * @private
   * @method _destroy
   * @memberOf Component
   */
  _destroy: function(){
    // apply destroy first for listener cleanup
    Marionette.StateObject.prototype.destroy.apply(this, arguments);

    if(this.region) {
      this.region.empty();
    }
  },

  /**
   * If the component should be destroyed, destroy it.
   *
   * @public
   * @method destroy
   * @memberOf Component
   */
  destroy: function(){
    if(this._shouldDestroy) {
        this._destroy();
    }
  }
});

export default Component;
