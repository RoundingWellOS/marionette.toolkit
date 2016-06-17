#### v1.0.0

* `StateMixin`:
  * Replaces `StateClass` and is now a POJO instead of a `Marionette.object`
  * Can now be mixed into any `Marionette.Object` or `Marionette.View`
  * `stateDefaults` has been removed in favor of state being passed in `options` hash
  * `initState` adds ability to reinitialize state at any point during the life-time of `Marionette.object` / `Marionette.View`
  * `resetStateDefaults` adds ability to reset state defined in defaults
  * `destroyState` has been replaced by `_destoryState` to privatize state deletion
* `ChildAppsMixin`:
  * Now handles the adding and removing of childApps
  * Adds functionality to share options with all children via `childAppsOptions`
* `EventListenerMixin` now handles `App` event-listener functionality
* `Marionette.Toolkit.MixinState` is a utiltiy function created to make it easy to mix `StateMixin` into any `Marionette.object` or `Marionette.View`
* `AbstractApp` has been removed and functionality moved into `App`
* `App`:
  * Now extends Marionette.Object and not `StateClass` as `AbstractApp` previously did
  * It now mixes in `StateMixin`, `ChildAppsMixin`, and `EventListenerMixin`
  * An app can now be restarted and have it's state reinitialized via `restart`
  * `_isDestroyed` is now the last action of `destroy` method to align with Marionette v3
* `Component`:
  * Now extends a `Marionette.Object` and not `StateClass`
  * It now mixes in `StateMixin`
  * Stop passing entire `stateModel` to `currentView` in favor of passing only `attributes`
* Improve `ES6` usage
* Dependency:
  * Change `dependencies` to `peerdependencies`
  * Update to `Node` v4 and several other updates
* Build process updates:
  * Remove `_buildPackages` and `NPM` deploy functionality as project will no longer publish packages individually
  * Replace `Browserify` build process with `Rollup`
  * Move from `JSHint` to `ESLint`
* Test and Documentation updates

#### v0.4.2

* Deprecate modularized classes.

#### v0.4.1

* Updated underscore and backbone dependencies.
* Small refactor to defaulting empty passed in `options` as an object.

#### v0.4.0

* Toolkit now exports `App`, `Component` and `StateClass` to [npm separately](https://www.npmjs.com/browse/keyword/marionette.toolkit-modularized).
* `StateModel` can now be defined as a function returning a `Backbone.Model`
* A `Component` `ViewClass` can now be defined as a function returning a View
* If defining `childApps` as a function, it is now passed the same `options` as `initialize`
* Prevent an `App` from destroying more than once

#### v0.3.0

* Revert 0.2.2 bugfix
* Returning Toolkit as a require object `var Toolkit = require('Marionette.Toolkit');`
* Add name to childApp Instance and getName method
* Add bower.json definition
* Add appName to `DuplicateChildAppError`

#### v0.2.2

* Bug Fix - Passed in options to child app on start

#### v0.2.1

* No code changes
* Fixed html test runner
* Documentation update with version bump for npm publish ¯\_(ツ)_/¯

#### v0.2.0

* 100% Code Coverage **@brentli1**!!
* `Component` now mixes in the `StateModel` instance as `stateModel` instead of `model`
* `stateDefaults` are now on `StateClass` and `defaults` was removed from `Component
* Added `Toolkit.noConflict`
* `App` now has a `triggerStart` method that can be overridden to introduce async app starts
* `App` `buildApp` is now easier to override
* `Component` `buildView` is now easier to override
* You can now pass `options` to the `Component`'s view via `showIn` `show` and `renderView`
* `Component` now attaches its view as `currentView` instead of `view`
* bugfixes

#### v0.1.1

* Bug fixes for `StateClass` and `App`
* Tests for `App`


#### v0.1.0

* Initial release
