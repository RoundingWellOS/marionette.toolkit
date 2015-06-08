/**
 * marionette.toolkit - A collection of opinionated Backbone.Marionette extensions for large scale application architecture.
 * @version v0.4.0
 * @link https://github.com/RoundingWellOS/marionette.toolkit
 * @license MIT
 */
"use strict";

var _ = require("underscore");
var Backbone = require("backbone");
var Marionette = require("backbone.marionette");

var StateClass = Marionette.Object.extend({

  /**
   * The model class for _stateModel.
   * @type {Backbone.Model}
   * @default Backbone.Model
   */
  StateModel: Backbone.Model,

  /**
   * @public
   * @constructs StateClass
   * @param {Object} [options] - Settings for the stateClass.
   * @param {Object} [options.stateEvents] - Event hash bound from _stateModel to stateClass.
   * @param {Backbone.Model} [options.StateModel] - Model class for _stateModel.
   */
  constructor: function constructor(options) {
    options = options || {};

    // Make defaults available to this
    _.extend(this, _.pick(options, ["StateModel", "stateEvents", "stateDefaults"]));

    var StateModel = this._getStateModel(options);

    this._stateModel = new StateModel(_.result(this, "stateDefaults"));

    // Bind events from the _stateModel defined in stateEvents hash
    this.bindEntityEvents(this._stateModel, _.result(this, "stateEvents"));

    Marionette.Object.call(this, options);
  },

  /**
   * Get the StateClass StateModel class.
   * Checks if the `StateModel` is a model class (the common case)
   * Then check if it's a function (which we assume that returns a model class)
   *
   * @private
   * @method _getStateModel
   * @param {Object} [options] - Options that can be used to determine the StateModel.
   * @memberOf StateClass
   * @returns {Backbone.Model}
   */
  _getStateModel: function _getStateModel(options) {
    var StateModel = this.getOption("StateModel");

    if (StateModel.prototype instanceof Backbone.Model || StateModel === Backbone.Model) {
      return StateModel;
    } else if (_.isFunction(StateModel)) {
      return StateModel.call(this, options);
    } else {
      throw new Marionette.Error({
        name: "InvalidStateModelError",
        message: "\"StateModel\" must be a model class or a function that returns a model class"
      });
    }
  },

  /**
   * Set a property on the _stateModel.
   *
   * @public
   * @method setState
   * @memberOf StateClass
   * @param {String|Object} key - Attribute name or Hash of any number of key value pairs.
   * @param {*} [value] - Attribute value if key is String, replaces options param otherwise.
   * @param {Object} [options] - Backbone.Model options.
   * @returns {Backbone.Model} - The _stateModel
   */
  setState: function setState() {
    return this._stateModel.set.apply(this._stateModel, arguments);
  },

  /**
   * Get a property from the _stateModel, or return the _stateModel
   *
   * @public
   * @method getState
   * @memberOf StateClass
   * @param {String} [attr] - Attribute name of stateModel.
   * @returns {Backbone.Model|*} - The _stateModel or the attribute value of the _stateModel
   */
  getState: function getState(attr) {
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
  destroy: function destroy() {
    this._stateModel.stopListening();

    Marionette.Object.prototype.destroy.apply(this, arguments);
  }
});

var state_class = StateClass;

module.exports = state_class;
//# sourceMappingURL=./StateClass.js.map