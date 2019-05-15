import _ from 'underscore';
import Backbone from 'backbone';
import { Application, View } from 'backbone.marionette';
import StateMixin from './mixins/state';
import ViewEventsMixin from './mixins/view-events';

const ClassOptions = [
  'regionOptions',
  'ViewClass',
  'viewEventPrefix',
  'viewEvents',
  'viewTriggers',
  'viewOptions'
];

/**
 * Reusable Marionette.MnObject with View management boilerplate
 *
 * @public
 * @class Component
 * @memberOf Toolkit
 * @memberOf Marionette
 */
const Component = Application.extend({

  /**
   * The view class to be managed.
   * @type {Mn.View|Mn.CollectionView}
   * @default Marionette.View
   */
  ViewClass: View,

  /**
   * @public
   * @constructs Component
   * @param {Object} [options] - Settings for the component.
   * @param {Object} [options.state] - Attributes to set on the state model.
   * @param {Mn.View|Mn.CollectionView} [options.ViewClass]
   * - The view class to be managed.
   * @param {String} [options.viewEventPrefix]
   * - Used as the prefix for events forwarded from the component's view to the component
   * @param {Object} [options.viewOptions] - Options hash passed to an instantiated ViewClass.
   * @param {Marionette.Region} [options.region] - The region to show the component in.
   */
  constructor(options = {}) {
    // Make defaults available to this
    this.mergeOptions(options, ClassOptions);

    this.options = _.extend({}, _.result(this, 'options'), options);

    // ViewEventMixin
    this._buildEventProxies();

    // StateMixin
    this._initState(options);

    Application.call(this, options);

    // StateMixin
    this.delegateStateEvents();
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
  showIn(region, viewOptions) {
    this._region = region;

    this.show(viewOptions);

    return this;
  },

  /**
   * Show the Component in its region.
   *
   * @public
   * @event Component#before:show
   * @event Component#show
   * @throws ComponentRegionError - Thrown if component has no defined region.
   * @method show
   * @param {Object} [viewOptions] - Options hash mixed into the instantiated ViewClass.
   * @param {Object} [regionOptions] - Options hash passed to the region on show.
   * @memberOf Component
   * @returns {Component}
   */
  show(viewOptions, regionOptions) {
    const region = this.getRegion();

    if(!region) {
      throw new Error('Component has no defined region.');
    }

    const view = this._getView(viewOptions);

    this.stopListening(region.currentView, 'destroy', this.destroy);

    this.triggerMethod('before:show', this, view, viewOptions, regionOptions);

    this.showView(view, this.mixinRegionOptions(regionOptions));

    this.listenTo(region.currentView, 'destroy', this.destroy);

    this.triggerMethod('show', this, view, viewOptions, regionOptions);

    return this;
  },

  /**
   * Empty the Components region without destroying it
   *
   * @public
   * @throws ComponentRegionError - Thrown if component has no defined region.
   * @method empty
   * @memberOf Component
   * @returns {Component}
   */
  empty() {
    const region = this.getRegion();

    if(!region) {
      throw new Error('Component has no defined region.');
    }

    this.stopListening(region.currentView, 'destroy', this.destroy);

    region.empty();

    return this;
  },

  /**
   * Mixin regionOptions
   *
   * @public
   * @abstract
   * @method mixinRegionOptions
   * @memberOf Component
   * @param {Object} [options] - Additional options to mixin
   * @returns {Object}
   */
  mixinRegionOptions(options) {
    const regionOptions = _.result(this, 'regionOptions');

    return _.extend({}, regionOptions, options);
  },

  /**
   * Get the Component view instance.
   *
   * @private
   * @method _getView
   * @memberOf Component
   * @param {Object} [options] - Options that can be used to determine the ViewClass.
   * @returns {View}
   */
  _getView(options) {
    const ViewClass = this._getViewClass(options);

    const viewOptions = this.mixinViewOptions(options);

    const view = this.buildView(ViewClass, viewOptions);

    // ViewEventMixin
    this._proxyViewEvents(view);

    return view;
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
  _getViewClass(options = {}) {
    const ViewClass = this.ViewClass;

    if(ViewClass.prototype instanceof Backbone.View || ViewClass === Backbone.View) {
      return ViewClass;
    } else if(_.isFunction(ViewClass)) {
      return ViewClass.call(this, options);
    }

    throw new Error('"ViewClass" must be a view class or a function that returns a view class');
  },

  /**
   * Mixin initial State with any other viewOptions
   *
   * @public
   * @abstract
   * @method mixinViewOptions
   * @memberOf Component
   * @param {Object} [options] - Additional options to mixin
   * @returns {Object}
   */
  mixinViewOptions(options) {
    const viewOptions = _.result(this, 'viewOptions');

    return _.extend({ state: this.getState().attributes }, viewOptions, options);
  },

  /**
   * Builds the view class with options
   * If you need a dynamic ViewClass override this function
   *
   * @public
   * @abstract
   * @method buildView
   * @memberOf Component
   * @param {Mn.View|Mn.CollectionView} ViewClass -
   * The view class to instantiate.
   * @param {Object} [viewOptions] - Options to pass to the View
   * @returns {Mn.View|Mn.CollectionView}
   */
  buildView(ViewClass, viewOptions) {
    return new ViewClass(viewOptions);
  },

  /**
   * Empty the region and destroy the component.
   *
   * @public
   * @method destroy
   * @param {Object} [options] - Options passed to Mn.Application `destroy`
   * @memberOf Component
   */
  destroy() {
    if(this._isDestroyed) {
      return this;
    }

    const region = this.getRegion();
    if(region) region.empty();

    Application.prototype.destroy.apply(this, arguments);

    return this;
  }
}, {
  /**
   * Sets the region for a Component Class
   *
   * @public
   * @method setRegion
   * @param {Marionette.Region} - region definition for instantiated components
   * @memberOf Component.prototype
   */
  setRegion(region) {
    this.prototype.region = region;
  }
});

_.extend(Component.prototype, StateMixin, ViewEventsMixin);

export default Component;
