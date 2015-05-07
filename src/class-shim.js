import _ from 'underscore';
import Backbone from 'backbone';
import Metal from 'backbone-metal';
import Marionette from 'backbone.marionette';

function classify(obj) {
  return Metal.Class.extend(
    _.extend({constructor: obj}, _.omit(obj.prototype, _.keys(Backbone.Events))),
    _.omit(obj, _.keys(Metal.Class))
  );
}

/**
 *  Marionette.Class shim
 *
 */
if(!Marionette.Class) {
  Marionette.Class = classify(Marionette.Object || Marionette.Controller);
}
