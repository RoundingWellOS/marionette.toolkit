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
