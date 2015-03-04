#### v0.2.0

* 100% Code Coverage **@brentli1**!!
* `Component` now mixes in the `StateModel` instance as `stateModel` instead of `model`
* `stateDefaults` are now on `StateClass` and `defaults` was removed from `Component
* Added `Toolkit.noConflict`
* `App` now has a `triggerStart` method that can be overridden to introduce async app starts.
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
