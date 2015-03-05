# Marionette.Toolkit.AbstractApp

`Marionette.Toolkit.AbstractApp` is an extention of [`StateClass`](./state-class.md).  Its purpose is to provide an object with a `initialize`/`start`/`stop`/`destroy` lifecycle.  All events bound to the `AbstractApp` while running (and only those) will be removed when stopped.

**Note:** `Marionette.Toolkit.AbstractApp` class is not intended to be used directly. It will eventually become the [`App`](./app.md) class once the "App Manager" functionality is mixed in, instead of extending from this `AbstractApp`.

## Documentation Index
* [Lifecycle Settings](#lifecycle-settings)
  * [App's `startAfterInitialized`](#apps-startafterinitialized)
  * [App's `preventDestroy`](#apps-preventdestroy)
  * [App's `startWithParent`](#apps-startwithparent)
  * [App's `stopWithParent`](#apps-stopwithparent)
* [Lifecycle API](#lifecycle-api)
  * [App `start`](#app-start)
  * [App `stop`](#app-stop)
  * [App `isRunning`](#app-isrunning)
  * [App `destroy`](#app-destroy)
  * [App `isDestroyed`](#app-isdestroyed)
* [Lifecycle Events](#lifecycle-events)
  * ["before:start" / "start" events](#beforestart--start-events)
  * ["before:stop" / "stop" events](#beforestop--stop-events)
* [Event Management](#event-management)

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
If set `false` Default value is `true`.
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

```js
var myApp = new Marionette.Toolkit.App();

myApp.on('start', function(options){
  console.log('My App Started!');
  options.foo === true;
});

// false
myApp.isRunning();


// "My App Started!" logged
myApp.start({
  foo: true
});

// true
myApp.isRunning();

// Nothing is logged
myApp.start();
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

### App `isDestroyed`

Returns a Boolean indicating whether or not the `App` is destroyed.  Destroyed `App`s cannot be started or used.

```js
var myApp = new Marionette.Toolkit.App();

myApp.isDestroyed() === false;

myApp.destroy();

myApp.isDestroyed() === true;

```

## Lifecycle Events

### `before:start` / `start` events

The "before:start" event and corresponding `onBeforeStart`
method are triggered just before the `App` `isRunning` is set `true`.

The "start" event and corresponding `onStart`
method are triggered after the `App` `isRunning` is set `true`.

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

## Event Management

When the app [`isRunning`](#app-isrunning) any event added via
`on`, `once`, `listenTo`, or `listenToOnce` are registered with the `App`.
These registered events are removed when the `App` is [stopped](#app-stop).

```js
var myApp = new Marionette.Toolkit.App();

myApp.on('do:foo', function(){
  console.log('Foo!');
});

myApp.start();

myApp.on('do:bar', function(){
  console.log('Bar!');
});

// Console logs "Foo!"
myApp.trigger('do:foo');

// Console.logs "Bar!"
myApp.trigger('do:bar');

myApp.stop();

// Console logs "Foo!"
myApp.trigger('do:foo');

// Nothing in the console
myApp.trigger('do:bar');

```
