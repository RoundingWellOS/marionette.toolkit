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
   * @type {Marionette.ItemView|Marionette.CollectionView|Marionette.CompositeView|Marionette.LayoutView}
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
   * @param {Marionette.ItemView|Marionette.CollectionView|Marionette.CompositeView|Marionette.LayoutView} [options.ViewClass] - The view class to be managed.
   * @param {String} [options.viewEventPrefix] - Used as the prefix for events forwarded from the component's view to the component
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

  showIn: function(region) {
    if(region) {
        this.region = region;
    }

    this.show();
  },

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
  },

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
  },

  _proxyViewEvents: function(){
    // Proxies the ViewClass's viewEvents to the Component itself
    // similar to CollectionView childEvents
    // (http://marionettejs.com/docs/v2.3.2/marionette.collectionview.html#collectionviews-childevents)

    var prefix = this.getOption('viewEventPrefix');

    this.view.on('all', function() {
      var args = _.toArray(arguments);
      var rootEvent = args[0];

      args[0] = prefix + ':' + rootEvent;
      args.splice(1, 0, this.view);

      this.triggerMethod.apply(this, args);
    }, this);
  },

  // mixin _state_model from StateObject with any other viewOptions
  mixinOptions: function(options){
    return _.extend({ model: this.getState() }, this.viewOptions, options);
  },

  buildView: function() {
    return new this.ViewClass(this.mixinOptions());
  },

  _destroy: function(){
    // apply destroy first for listener cleanup
    Marionette.StateObject.prototype.destroy.apply(this, arguments);

    this.region.empty();
  },

  destroy: function(){
    if(this._shouldDestroy) {
        this._destroy();
    }

    return this;
  }
});

export default Component;
