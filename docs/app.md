# Marionette.Toolkit.App

`Marionette.Toolkit.App` is an extension of `Marionette.Application`. Its purpose is to provide an object with a `initialize`/`start`/`stop`/`destroy` lifecycle. `App` has several mixins:

* [`StateMixin`](./mixins/state.md) to maintain application state.
* [`EventListenersMixin`](./mixins/event-listeners.md) to bind all events to an `App` while running (and only those) will be remove when stopped.
* [`ChildAppsMixin`](./mixins/child-apps.md) to manage the addition and removal of child `App`s and relating the child `App` lifecycle with the parent `App` lifecycle.

## Documentation Index
* [Using Toolkit App](#using-toolkit-app)
* [Lifecycle Settings](#lifecycle-settings)
  * [App's `startAfterInitialized`](#apps-startafterinitialized)
  * [App's `preventDestroy`](#apps-preventdestroy)
  * [App's `startWithParent`](#apps-startwithparent)
  * [App's `stopWithParent`](#apps-stopwithparent)
* [Lifecycle API](#lifecycle-api)
  * [App `start`](#app-start)
  * [App `restart`](#app-restart)
  * [App `stop`](#app-stop)
  * [App `isRunning`](#app-isrunning)
  * [App `destroy`](#app-destroy)
* [Lifecycle Events](#lifecycle-events)
  * ["before:start" / "start" events](#beforestart--start-events)
  * ["before:stop" / "stop" events](#beforestop--stop-events)
* [Application Region](#application-region)
  * [App `setRegion`](#app-setregion)
* [Application State](#application-state)
  * [App `StateModel`](#app-statemodel)
  * [App `stateEvents`](#app-stateevents)
* [Application View](#application-view)
  * [App `showChildView`](#app-showchildview)
  * [App `getChildView`](#app-getchildview)

## Using Toolkit App

Beyond the Toolkit App's lifecycle, its biggest feature is [childApps](./mixings/child-apps.md#apps-childapps).
This allows children to be tied to the lifecycle of their parent's lifecycle.
As Toolkit App extends [`Marionette.Application`](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.application.md) it can be used as a drop-in replacement.

## Lifecycle Settings

### App's `startAfterInitialized`

Call `start` immediately after `initialize` if `true`.  Default value is `false`.
Can be added as an option when instantiated or defined on the `App` definition.
It can also be defined as a function returning a boolean value.

```js
var MyApp = Marionette.Toolkit.App.extend({
  initialize: function(){
    this.isRunning() === false;
  },
  startAfterInitialized: true
});

var myApp = new MyApp();

myApp.isRunning() === true;

```

### App's `preventDestroy`

If set `true` this `App` will not be destroyed when its parent `App` is destroyed.
Default value is `false`.
Can be added as an option when instantiated or defined on the `App` definition.
It can also be defined as a function returning a boolean value.

```js
var myApp = new Marionette.Toolkit.App();

var myChildApp = myApp.addChildApp('myChildApp', {
  AppClass: Marionette.Toolkit.App,
  preventDestroy: false
});

var myPreventDestroyApp = myApp.addChildApp('myPreventDestroyApp', {
  AppClass: Marionette.Toolkit.App,
  preventDestroy: true
});

myApp.destroy();

// logs true
console.log(myChildApp.isDestroyed());

// logs false
console.log(myPreventDestroyApp.isDestroyed());

```

### App's `startWithParent`

If set `true` this `App` will start when its parent `App` starts.
Default value is `false`.
Can be added as an option when instantiated or defined on the `App` definition.
It can also be defined as a function returning a boolean value.

```js
var myApp = new Marionette.Toolkit.App();

var myChildApp = myApp.addChildApp('myChildApp', {
  AppClass: Marionette.Toolkit.App,
  startWithParent: false
});

var myStartWithParentApp = myApp.addChildApp('myStartWithParentApp', {
  AppClass: Marionette.Toolkit.App,
  startWithParent: true
});

myApp.start();

// logs false
console.log(myChildApp.isRunning());

// logs true
console.log(myStartWithParentApp.isRunning());
```

### App's `stopWithParent`

If set `true` this `App` will stop when its parent `App` stops.
Default value is `true`.
Can be added as an option when instantiated or defined on the `App` definition.
It can also be defined as a function returning a boolean value.

```js
var myApp = new Marionette.Toolkit.App();

var myChildApp = myApp.addChildApp('myChildApp', {
  AppClass: Marionette.Toolkit.App,
  stopWithParent: false
});

var myStopWithParentApp = myApp.addChildApp('myStopWithParentApp', {
  AppClass: Marionette.Toolkit.App,
  stopWithParent: true
});

myApp.start();
myChildApp.start();
myStopWithParentApp.start();

myApp.stop();

// logs true
console.log(myChildApp.isRunning());

// logs false
console.log(myStopWithParentApp.isRunning());
```

## Lifecycle API

### App `start`

This method sets the `App` to its running state.
Events added after `start` are registered for removal `onStop`.
This triggers ["before:start" / "start" events](#beforestart--start-events).

Initial state can be passed as an option to `start`.

```js
var myApp = new Marionette.Toolkit.App();

myApp.on('start', function(options){
  console.log('My App Started!');
  options.foo === true;
  this.getState('bar') === 'baz';
});

// false
myApp.isRunning();

var initialState = {
  bar: 'baz'
};

// "My App Started!" logged
myApp.start({
  foo: true,
  state: initialState
});

// true
myApp.isRunning();

// Nothing is logged
myApp.start();
```

### App `restart`

This method saves the current state of the app before stopping it.
It then starts the app again with the preserved state attributes.

```js
var myApp = new Marionette.Toolkit.App();

myApp.on('before:start', function(options) {
    console.log(options.state);
});

var initialState = {
  foo: 'bar'
};

// logs { foo: 'bar' }
myApp.start({
  state: initialState
});

myApp.setState('foo', 'baz');

// logs { foo: 'baz' }
myApp.restart();
```

### App `stop`

This method stops the `App`'s running state.
Events added after `start` are registered for removal `onStop`.
This triggers ["before:stop" / "stop" events](#beforestop--stop-events).

```js
var myApp = new Marionette.Toolkit.App();

myApp.on('stop', function(options){
  console.log('My App Stopped!');
  options.foo === true;
});

// Nothing is logged
myApp.stop();


myApp.start();

// true
myApp.isRunning();

// "My App Stopped!" logged
myApp.stop({
  foo: true
});

// false
myApp.isRunning();

// Nothing is logged
myApp.stop();
```

### App `isRunning`

Returns a Boolean indicating whether or not the `App` is running.

```js
var myApp = new Marionette.Toolkit.App();

myApp.start();

myApp.isRunning() === true;

myApp.stop();

myApp.isRunning() === false;

```

### App `isRestarting`

Returns a Boolean indicating whether or not the `App` is restarting.

```js
var myApp = new Marionette.Toolkit.App();

myApp.on('before:stop', function(options) {
    console.log(this.isRestarting());
});

myApp.start();

// logs true
myApp.restart();

// logs false
myApp.stop();

```

### App `destroy`

This method stops the `App` if running and sets the `App`'s state to destroyed.

```js
var myApp = new Marionette.Toolkit.App();

myApp.start();

myApp.isRunning() === true;
myApp.isDestroyed() === false;

myApp.destroy();

myApp.isRunning() === false;
myApp.isDestroyed() === true;

```

## Lifecycle Events

### `before:start` / `start` events

The "before:start" event and corresponding `onBeforeStart`
method are triggered just before the `App` `isRunning` is set `true`. This is the appropriate place to set up your app's initial state. Calling `setState` in `onBeforeStart` will not trigger any events.

The "start" event and corresponding `onStart`
method are triggered after the `App` `isRunning` is set `true`. Once `onStart` is run, state event listeners have been applied.

```js
var MyApp = Marionette.Toolkit.App.extend({
  // ...

  onBeforeStart: function(options){
    // ...
  },

  onStart: function(options){
    // ...
  }
});

var myApp = new MyApp({...});

myApp.on('before:start', function(options){
  // ...
});

myApp.on('start', function(options){
  // ...
});
```

### `before:stop` / `stop` events

The "before:stop" event and corresponding `onBeforeStop`
method are triggered just before the `App` `isRunning` is set `false`.

The "stop" event and corresponding `onStop`
method are triggered after the `App` `isRunning` is set `false`.

```js
var MyApp = Marionette.Toolkit.App.extend({
  // ...

  onBeforeStop: function(options){
    // ...
  },

  onStop: function(options){
    // ...
  }
});

var myApp = new MyApp({...});

myApp.on('before:stop', function(options){
  // ...
});

myApp.on('stop', function(options){
  // ...
});
```

## Application Region

A `Marionette.Region` instance can be passed to [App `start`](#app-start) as an option,
[setting the App region](#app-setregion), making it available to both [`before:start` and `start`](#beforestart--start-events) events.

### App `setRegion`

Calling `setRegion` will replace the `App`'s region making it available to the App's [Region API](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.application.md#getregion).

## Application State

Application state can be passed to [App `start`](#app-start) as an option. The state is maintained while the app is running.

### App `StateModel`

A [`StateModel`](./mixins/state.md#statemixins-statemodel) class can be passed to App instantiation as an option or defined on the App.

```js
var myApp = new MyApp({
  StateModel: MyStateModel
});
```

### App `stateEvents`

A [`stateEvents`](./mixins/state.md#statemixins-stateevents) hash can be passed to App instantiation as an option or defined on the App.

```js
var MyApp = Marionette.Toolkit.App.extend({
  stateEvents: {
    'change': 'onChangeState'
  }
  onChangeState: function() {
    // Handle state change event
  }
});
```

## Application View

A [`Marionette.Application`](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.application.md) can have an associated view shown in its region with `showView`. Toolkit takes this a step further and proxies that view's `showChildView` and `getChildView`. This is simply sugar for common patterns.

### App `showChildView`

This method will help when a region from the App's view is needed.

It has the same API as a `Marionette.View`'s `showChildView` and returns the show view.

```js
myApp.showChildView('fooRegion', myChildView, 'fooArg');

//is equivalent to
myApp.getView().getRegion('fooRegion').show(myChildView, 'fooArg');
```

### App `getChildView`

Like `showChildView`, `getChildView` is a helper for getting a view shown in a region belonging to the App's view.

It has the same API as a `Marionette.View`'s `getChildView`.

```js
myApp.getChildView('fooRegion');

//is equivalent to
myApp.getView().getRegion('fooRegion').currentView;
```
