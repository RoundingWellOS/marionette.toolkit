import _ from 'underscore';
import Marionette from 'backbone.marionette';
import StateClass from './state-class';

// var MyComponent = Toolkit.Component.extend({
//     state model defaults
//     defaults: {
//         pressed: true
//     },
//     viewEventPrefix: 'mine',
//     viewOptions: {
//         className: 'button--light-gradient faux-select w-100',
//         templateHelpers: { }
//     },
//     stateEvents: {
//         'change:state_attribute': 'onNameChange'
//     },
//     onNameChange: function(){
//         // do stuff ...
//     }
// });

// var test_component = new MyComponent({},{
//     viewClass: MyView
//     viewEventPrefix: 'special:mine'
//     viewOptions: {}
//     region: this.layout.my_region
// });

// test_component.showIn(this.layout.region);


var Component = StateClass.extend({
  constructor: function(stateAttrs, options){
    options = options || {};
    // Make defaults available to this
    _.extend(this, _.pick(options, ['viewEventPrefix', 'viewClass', 'viewOptions', 'region']));

    Marionette.StateObject.call(this, options);

    this._setStateDefaults(stateAttrs);
  },

  _shouldDestroy: true,

  _setStateDefaults: function(stateAttrs){
    _.defaults(stateAttrs, _.result(this, 'defaults'));

    this.setState(stateAttrs, { silent: true });
  },

  viewEventPrefix: 'view',

  viewClass: Marionette.ItemView,

  viewOptions: {},

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
    // Proxies the viewClass's viewEvents to the Component itself
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
    return new this.viewClass(this.mixinOptions());
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