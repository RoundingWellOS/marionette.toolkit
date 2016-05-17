import _ from 'underscore';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

 /**
 * This provides methods used for keeping state using a Backbone.Model. It's meant to
 * be used with either a Marionette.Object or Backbone.View.
 *
 * @mixin
 */
export default {

  /**
   * The model class for _stateModel.
   * @type {Backbone.Model}
   * @default Backbone.Model
   */
  StateModel: Backbone.Model,

  /**
   * @public
   * @method initState
   * @param {Object} [options] - Settings for the stateClass.
   * @param {Object} [options.stateEvents] - Event hash bound from _stateModel to stateClass.
   * @param {Backbone.Model} [options.StateModel] - Model class for _stateModel.
   */
  initState(options = {}) {
    // Make defaults available to this
    this.mergeOptions(options, ['StateModel', 'stateEvents', 'stateDefaults']);

    // Remove event handlers from previous state
    this._removeEventHandlers();

    const StateModel = this._getStateModel(options);

    this._stateModel = new StateModel(_.result(this, 'stateDefaults'));

    this._setEventHandlers();
  },

  /**
   * Unbind all entity events and remove any listeners on _stateModel
   * Clean up destroy event handler
   *
   * @private
   * @method _removeEventHandlers
   */
  _removeEventHandlers() {
    if(!this._stateModel) return;

    this.unbindEntityEvents(this._stateModel);
    this._stateModel.stopListening();
    this.off('destroy', this._destroyState);
  },

  /**
   * Bind events from the _stateModel defined in stateEvents hash
   * Setup destroy event handle
   *
   * @private
   * @method _setEventHandlers
   */
  _setEventHandlers() {
    this.bindEntityEvents(this._stateModel, _.result(this, 'stateEvents'));

    this.on('destroy', this._destroyState);
  },

  /**
   * Get the StateClass StateModel class.
   * Checks if the `StateModel` is a model class (the common case)
   * Then check if it's a function (which we assume that returns a model class)
   *
   * @private
   * @method _getStateModel
   * @param {Object} [options] - Options that can be used to determine the StateModel.
   * @returns {Backbone.Model}
   */
  _getStateModel(options) {
    if(this.StateModel.prototype instanceof Backbone.Model || this.StateModel === Backbone.Model) {
      return this.StateModel;
    } else if(_.isFunction(this.StateModel)) {
      return this.StateModel.call(this, options);
    }

    throw new Marionette.Error({
      name: 'InvalidStateModelError',
      message: '"StateModel" must be a model class or a function that returns a model class'
    });
  },

  /**
   * Set a property on the _stateModel.
   *
   * @public
   * @method setState
   * @param {String|Object} key - Attribute name or Hash of any number of key value pairs.
   * @param {*} [value] - Attribute value if key is String, replaces options param otherwise.
   * @param {Object} [options] - Backbone.Model options.
   * @returns {Backbone.Model} - The _stateModel
   */
  setState() {
    return this._stateModel.set.apply(this._stateModel, arguments);
  },

  /**
   * Get a property from the _stateModel, or return the _stateModel
   *
   * @public
   * @method getState
   * @param {String} [attr] - Attribute name of stateModel.
   * @returns {Backbone.Model|*} - The _stateModel or the attribute value of the _stateModel
   */
  getState(attr) {
    if(!attr) {
      return this._stateModel;
    }

    return this._stateModel.get.apply(this._stateModel, arguments);
  },

  /**
   * Clean up any listeners on the _stateModel.
   *
   * @private
   * @method _destroyState
   */
  _destroyState() {
    this._stateModel.stopListening();
  }
};
