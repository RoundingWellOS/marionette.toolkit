#### v6.0.0

* **Breaking Changes**
  * Replaced `Component` with a simpler API.
    * `Component` now extends `Marionette.Application
    * Removes `removeView` for `show`
    * Adds `empty` for a safe destruction
    * Adds `regionOptions`
    * A Component can now be shown multiple times
    * Adds `setRegion` as a class method
  * Removed the default export
  * `MixinState` is now `mixinState`

* **Tooling**
  * Modernized build/test tooling

#### v5.1.0

* **Features**
  * Updated dependency versions

#### v5.0.0

* **Breaking Changes**
  * Upgraded to Marionette v4
  * `Toolkit` is no longer attached to `Marionette.Toolkit`
  * `noConflict` was removed
  * Removed bower
  * For apps the state model and listeners are now only init'd during runtime available first in `onBeforeStart` without listeners.
  * `triggerStart` now calls a `finallyStart` method rather than `triggerMethod` directly.

* **Features**
  * childApps definitions now support `regionName` and `getOptions` for boilerplate reduction.
  * Updated underscore dependency range
  * Added `toggleState` for a quick/clean `set('foo', !get('foo'))`
  * Added `hasState` for a quick/clean `this.getState().has('foo')`
  * `stopChildApp` now passes options along `this.stopChildApp('appName', { foo: true })`
  * `Component` now exposes `showView` so that the behavior can be overridden
  * `restartWithParent` was added to modify the behavior of child apps during `restart`

* **Fixes**
  * Child app was not removing correctly if startAfterInitialize: true
  * Fixed clean up for various app view removal methods

#### v4.0.0

* `App`
  * **Breaking Changes:**
    * Inits the state model before `before:start` and waits until before `start` to delegate `stateEvents`
    * Remove `getInitState` in favor of setting the state in `before:start`
    * `setRegion` now returns the set region instance
  * `destroy` now returns the app instance
  * `destroy` now calls the Application prototype instead of Object
  * Added `ViewEventsMixin`
  * Added `restart` and `isRestarting` feature
  * `start` now accepts a view option
  * Added `setView` / `getView` feature allowing setting up children with the App's API prior to `showView`
  * `getRegion` now accepts an argument of a region name that is sugar for `myApp.getView().getRegion('regionName')`
  * `showView` will show the "set" view if not passed a 1st argument
  * Added `showChildView` / `getChildView` for interaction with the children of the App's view

* `Component`
  * **Breaking Changes:**
    * `viewEventPrefix` is now defaulted to `false`
    * `stateEvents` is now delegated after `initialize` this allows for setState in `initialize`
  * Added `ViewEventsMixin`
  * `destroy` now returns the component instance

* `ChildAppMixin`
  * **Breaking Changes:**
    * `startChildApp` / `stopChildApp` now return the child app instance

* `StateMixin`
  * Add `delegateStateEvents` / `undelegateStateEvents` for binding and unbinding `stateEvents`

* `ViewEventsMixin` - This new mixin adds Marionette.View like support for view event proxying
The API is analogous to `childViewEventPrefix`, `childViewEvents` and `childViewTriggers`
  * `viewEventPrefix` defaulting to false allows for auto-proxying events from the view to the app or component
  * `viewEvents` allows app or component handlers of view events
  * `viewTriggers` triggers an event on the app or component when an event is triggered on the view

#### v3.1.0

* `App`
  * Fix `stateEvents` when passed at App instantiation
  * Fix leaky lingering `stateEvents` after App stop
  * Add App `showChildView` / `getChildView`

#### v3.0.1

* `App`
  * Revert the stop event is triggered after clearing running events

#### v3.0.0

* `App`
  * Add `setRegion` to modify an App's region
    * All `region` to be passed to `App#start`
  * `start` and `stop` are no longer binded to the App
  * the stop event is triggered after clearing running events
* General
  * Support lodash v4
  * Fixed an underscore import

#### v2.0.0

* `App`
  * The `App` now extends `Marionette.Application`
    * **Breaking Changes:**
      * Move `initState` from `App` constructor to `start`
      * Remove `restartState` functionality
    * Add `getInitState` functionality to allow user to override and modify state on App `start`
    * Remove `isDestroyed` functionality and `isDestroyed` flag as this is now supported in `Marionette.Application`
    * Allow user to pass in `StateModel` during `App` initialization via `ClassOptions`
* `Component`
  * ViewClass now uses `Marionette.View` instead of deprecated `Marionette.ItemView`
  * Add `getRegion` functionality
* `StateMixin`
  * Now uses `unbindEvents` instead of `unbindEntityEvents`
* `ChildAppsMixin`
  * Add `startChildApp`/`stopChildApp` functionality
* Dependency
  * Update and hard-set various dependencies, including Marionette, Backbone, and underscore

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
