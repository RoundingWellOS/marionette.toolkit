# Marionette.Toolkit.App

`Marionette.Toolkit.App` is an extension of `Marionette.Application`. Its purpose is to provide an object with a `initialize`/`start`/`stop`/`destroy` lifecycle. `App` has several mixins:

* [`StateMixin`](./mixins/state.md) to maintain application state.
* [`EventListenersMixin`](./mixins/event-listeners.md) to bind all events to an `App` while running (and only those) will be remove when stopped.
* [`ChildAppsMixin`](./mixins/child-apps.md) to manage the addition and removal of child `App`s and relating the child `App` lifecycle with the parent `App` lifecycle.
* [`ViewEventsMixin`](./mixins/view-events.md) for proxying events from the app's view to the app.

## Documentation Index
* [Using Toolkit App](#using-toolkit-app)
* [Lifecycle Settings](#lifecycle-settings)
  * [App's `startAfterInitialized`](#apps-startafterinitialized)
  * [App's `preventDestroy`](#apps-preventdestroy)
  * [App's `startWithParent`](#apps-startwithparent)
  * [App's `stopWithParent`](#apps-stopwithparent)
  * [App's `restartWithParent`](#apps-restartwithparent)
* [Lifecycle API](#lifecycle-api)
  * [App `start`](#app-start)
  * [App `restart`](#app-restart)
  * [App `stop`](#app-stop)
  * [App `isRunning`](#app-isrunning)
  * [App `destroy`](#app-destroy)
* [Lifecycle Events](#lifecycle-events)
  * ["before:start" / "start" events](#beforestart--start-events)
  * ["before:stop" / "stop" events](#beforestop--stop-events)
* [Application State](#application-state)
  * [App `StateModel`](#app-statemodel)
  * [App `stateEvents`](#app-stateevents)
* [Application Region](#application-region)
  * [App `setRegion`](#app-setregion)
  * [App `getRegion`](#app-getregion)
* [Application View](#application-view)
  * [App `setView`](#application-setview)
  * [App `getView`](#application-getview)
  * [App `showView`](#application-showview)
  * [App `showChildView`](#app-showchildview)
  * [App `getChildView`](#app-getchildview)
  * [View Events](#view-events)

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

### App's `restartWithParent`

Call `stop` then `start` on the child app when the parent app restarts.  Default value is `false`.
It can also be defined as a function returning a boolean value.

```js
var myApp = new Marionette.Toolkit.App();

var persistantChildApp = myApp.addChildApp('persistantChildApp', {
  AppClass: Marionette.Toolkit.App,
  restartWithParent: false
});

persistantChildApp.on('stop start', function(options) {
    console.log(this.isRestarting());
});

// does not log
myApp.restart();

var restartingChildApp = myApp.addChildApp('restartingChildApp', {
  AppClass: Marionette.Toolkit.App,
  restartWithParent: true
});

restartingChildApp.on('stop start', function(options) {
    console.log(this.isRestarting());
});

// logs true twice
myApp.restart();

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

## Application State

Application state can be passed to [App `start`](#app-start) as a `state` option. The state is maintained while the app is running.

```js
myApp.start({
  state: {
    limit: 10
  }
});

myApp.getState('limit') === 10;
```

## Application Region

A `Marionette.Region` instance can be passed to [App `start`](#app-start) as a `region` option,
[setting the App region](#app-setregion), making it available to both [`before:start` and `start`](#beforestart--start-events) events.

```js
myApp.start({
  region: myRegion
});

myApp.getRegion() === myRegion;
```

### App `setRegion`

Calling `setRegion` will replace the `App`'s region making it available to the App's [Region API](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.application.md#getregion).
Unlike `Marionette.Appliation`'s [region attribute](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.application.md#root-layout), `setRegion` only accepts a Region instance.

```js
myApp.setRegion(myView.getRegion('appRegion'));

```

### App `getRegion`

`getRegion` performs two functions. When passed no arguments returns the app's region.
You can also give `getRegion` a region name string which will attempt to return a region from the app's view.
It is sugar for `myApp.getView().getRegion('regionName') === myApp.getRegion('regionName');`.

```js
const MyApp = Toolkit.App.extend({
  region: '#app-hook'
});

const myView = new Mn.View({
  template: MyTemplate,
  regions: {
    foo: '#foo'
  }
});

myApp.getRegion(); // #app-hook region

myApp.showView(myView);
myApp.getRegion('foo');  // foo region on myView
```

## Application View

A [`Marionette.Application`](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.application.md) can have an associated view shown in its region with `showView`.
Toolkit takes this a step further and proxies that view's `showChildView` and `getChildView`. This is simply sugar for common patterns.
A View instance can be passed to [App `start`](#app-start) as an option,
[setting the App view](#app-setview), making it available to both [`before:start` and `start`](#beforestart--start-events) events.

```js
myApp.start({
  view: myView
});

myApp.getView() === myView;
```

### App `setView`

Assign a view to an App. There are two notable use cases for this.
First, this allows you to use `App.getRegion('regionName')` or `App.showChildView`
without first showing the view in the App's region. This way all of the App's children
can be setup and rendered prior to attaching anything to the DOM.

```js
const MyApp = Toolkit.App.extend({
  onStart() {
    this.setView(myLayoutView);
    this.startChildApp('child', { region: this.getRegion('child') });
    this.showChildView('title', 'My App');
    this.showView();
  }
});
```

The second is when you want to associate an App with a view already in a region or one that
won't be shown in a region.

```js
const myView = new Mn.View.extend({
  el: $('#existing-dom'),
  regions: {
    foo: '#foo'
  }
});

const myApp = new MyApp();

myApp.start();

myApp.setView(myView);

myApp.getRegion('foo') === myView.getRegion('foo');
```

`setView` returns the view.

```js

const myView = myApp.setView(new MyView());

// myApp.listenTo(myView, ...);
```

### App `getView`

Returns the view instance associated with the App.

```js
myApp.setView(fooView);

myApp.getView() === fooView;

myApp.showView(barView);

myApp.getView() === barView;

myApp.getRegion().show(bazView);

myApp.getView() === bazView;
```

### App `showView`

Shows a view instance in the App's region.
The first argument for `showView` is the view instance, but if left undefined the App will
attempt to use the current view ie: `myApp.getView()`. The second argument is region.show options

```js
myApp.showView(myView, { replaceElement: true });


// Alternatively
myApp.setView(fooView);

// Show fooView
myApp.showView();
```

`showView` returns the view.

```js

const myView = myApp.showView(new MyView());

// myApp.listenTo(myView, ...);
```

### App `showChildView`

This method will help when a region from the App's view is needed.

It has the same API as a `Marionette.View`'s `showChildView` and returns the show view.

```js
myApp.showChildView('fooRegion', myChildView, 'fooArg');

//is equivalent to
myApp.getView().getRegion('fooRegion').show(myChildView, 'fooArg');
```

`showChildView` returns the child view.

```js

const myView = myApp.showChildView('fooRegion', new MyView());

// myApp.listenTo(myView, ...);
```

### App `getChildView`

Like `showChildView`, `getChildView` is a helper for getting a view shown in a region belonging to the App's view.

It has the same API as a `Marionette.View`'s `getChildView`.

```js
myApp.getChildView('fooRegion');

//is equivalent to
myApp.getView().getRegion('fooRegion').currentView;
```

### View events

View events for an App's view can be proxied following a very similar API to what you would
expect on a `Marionette.View` and `Marionette.CollectionView` with their children.

You can use `viewEvents`, `viewTriggers` and `viewEventPrefix` for auto-proxying events.

For more information see the [ViewEventsMixin documentation](./mixins/view-events.md).
