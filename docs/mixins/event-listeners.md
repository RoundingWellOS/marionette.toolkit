# EventListernersMixin

`EventListernersMixin` is a private mixin for [`App`](../app.md). It adds functionality to binds events to the `App` while running and removed (and only those) when the `App` is stopped.

## Documentation Index

* [Event Management](#event-management)

## Event Management

When the app [`isRunning`](../app.md#app-isrunning) any event added via
`on`, `once`, `listenTo`, or `listenToOnce` are registered with the `App`.
These registered events are removed when the `App` is [stopped](../app.md#app-stop).

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
